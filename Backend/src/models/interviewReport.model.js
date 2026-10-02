const mongoose = require('mongoose');

/**
 * - job description: The job description for the interview.
 * - resume text: The text of the resume used for the interview.
 * - self description: The self-description provided by the candidate.
 * 
 * - matchScore: The match score between the resume and the job description.
 * 
 * - interview questions: 
 *          [{
 *               question: String,
 *               intention: String,
 *               answer: String
 *          }]
 * - behavioral questions: [{
 *               question: String,
 *               intention: String,
 *               answer: String
 *          }]
 * - skillGaps: [{
 *               skill: String,
 *               severity: String
 *          }]
 * - preparation plan: [{
 *               day: Number,
 *               topic: String,
 *               focus: String,
 *          }]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true  
    },
    intention: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
},{
    _id: false
});

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true  
    },
    intention: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
},{
    _id: false
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        required: true
    }
},{
    _id: false
});

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    tasks: {
        type: [String],
        required: true
    },
    focus: {
        type: String,
        required: true
    }
},{
    _id: false
});

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: true
    }, 
    resumeText: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {  
        type: Number,
        min: 0,
        max: 100    
    },  
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }   
},{
    timestamps: true    
});

const InterviewReport = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = InterviewReport;
