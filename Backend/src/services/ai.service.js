const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API
});

const interviewReportSchema = z.object({
    matchScore: z
        .number()
        .describe("The match score between the candidate's resume and the job description, from 0 to 100."),

    technicalQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe("A technical interview question that the interviewer can ask the candidate."),

                intention: z
                    .string()
                    .describe("The interviewer's intention or what skill/knowledge the question is evaluating."),

                answer: z
                    .string()
                    .describe("A strong sample answer personalized to the candidate's resume and experience.")
            })
        )
        .describe("Technical interview questions relevant to the candidate's resume and the job description."),

    behavioralQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe("A behavioral interview question that the interviewer can ask the candidate."),

                intention: z
                    .string()
                    .describe("The interviewer's intention or the behavior/soft skill being evaluated."),

                answer: z
                    .string()
                    .describe("A strong sample answer personalized to the candidate's actual experience.")
            })
        )
        .describe("Behavioral interview questions relevant to the candidate's experience and the job requirements."),

    skillGaps: z
        .array(
            z.object({
                skill: z
                    .string()
                    .describe("A technical or professional skill that the candidate lacks or needs to improve based on the job description."),

                severity: z
                    .enum(["low", "medium", "high"])
                    .describe("The severity of the skill gap: low, medium, or high.")
            })
        )
        .describe("Skills required by the job description that are missing, weak, or insufficiently demonstrated in the candidate's resume."),

    preparationPlan: z
        .array(
            z.object({
                day: z
                    .number()
                    .describe("The number of days allocated to this preparation area." ),

                focus: z
                    .string()
                    .describe("The main topic or area the candidate should focus on."),

                tasks: z
                    .array(z.string())
                    .describe("Specific tasks the candidate should complete during this preparation period.")
            })
        )
        .describe("A practical interview preparation plan based on the candidate's skill gaps and job requirements.")
});

// Gemini structured output schema
const geminiSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: {
            type: Type.NUMBER
        },
        technicalQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING },
                    severity: {
                        type: Type.STRING,
                        enum: ["low", "medium", "high"]
                    }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER },
                    focus: { type: Type.STRING },
                    tasks: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: [
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan"
    ]
};


async function generateInterviewReport({resume, jobDescription, selfDescription}) {

    const prompt =`
            You are an expert technical interviewer.
            Analyze the following candidate for the given job.
            RESUME: ${resume}
            JOB DESCRIPTION: ${jobDescription}
            SELF DESCRIPTION: ${selfDescription}

            Generate an interview preparation report.
            Return the following fields exactly:
            1. matchScore: A number between 0 and 100.
            2. technicalQuestions: An array of objects containing
            question, intention, answer.
            3. behavioralQuestions: An array of objects containing
            question, intention, answer.
            4. skillGaps: An array of objects containing
            skill and severity (low, medium, or high).
            5. preparationPlan: An array of objects containing
            day, focus, and tasks.

            Generate at least:
            - 5 technical questions
            - 5 behavioral questions
            - 3 skill gaps
            - 5 preparation plan entries


            Follow the provided JSON response schema exactly.
            `;

    const response = await ai.models.generateContent({ 
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: geminiSchema
        }
    });

    const data = JSON.parse(response.text);
    const validatedData = interviewReportSchema.parse(data);
    return validatedData;
    
    
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }