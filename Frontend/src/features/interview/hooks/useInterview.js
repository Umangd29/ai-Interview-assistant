
import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf
} from '../services/interview.api'

import {
    useContext,
    useEffect,
    useCallback,
    useState
} from 'react'

import { InterviewContext } from '../interview.context'
import { useParams } from 'react-router'

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()
    const [error, setError] = useState('')

    if (!context) {
        throw new Error(
            'useInterview must be used within an InterviewProvider'
        )
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports
    } = context

    // Generate a new interview report
    const generateReport = useCallback(async ({
        jobDescription,
        selfDescription,
        resumeFile
    }) => {
        setLoading(true)
        setError('')

        try {
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            // Supports either Axios response or direct response data
            const data = response?.data ?? response
            const interviewReport = data?.interviewReport

            if (!interviewReport) {
                throw new Error(
                    'The server did not return an interview report.'
                )
            }

            setReport(interviewReport)

            return interviewReport
        } catch (err) {
            console.error('Generate report error:', err)

            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to generate interview report.'
            )

            throw err
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport])

    // Fetch a report using its ID
    const getReportById = useCallback(async (id) => {
        if (!id) {
            throw new Error('Interview report ID is missing.')
        }

        setLoading(true)
        setError('')

        try {
            const response = await getInterviewReportById(id)

            const data = response?.data ?? response
            const interviewReport = data?.interviewReport

            if (!interviewReport) {
                throw new Error('Interview report was not found.')
            }

            setReport(interviewReport)

            return interviewReport
        } catch (err) {
            console.error('Get report error:', err)

            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to load interview report.'
            )

            throw err
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport])

    // Fetch all reports
    const getReports = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const response = await getAllInterviewReports()

            const data = response?.data ?? response
            const interviewReports = data?.interviewReports ?? []

            setReports(interviewReports)

            return interviewReports
        } catch (err) {
            console.error('Get reports error:', err)

            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to load interview reports.'
            )

            throw err
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReports])

    // Generate and download the interview PDF
    const getResumePdf = useCallback(async (interviewReportId) => {
        if (!interviewReportId) {
            throw new Error('Interview report ID is missing.')
        }

        setLoading(true)
        setError('')

        try {
            const response = await generateResumePdf({
                interviewReportId
            })

            // Supports Axios response or direct Blob/data
            const pdfData = response?.data ?? response

            const pdfBlob = pdfData instanceof Blob
                ? pdfData
                : new Blob([pdfData], {
                    type: 'application/pdf'
                })

            if (pdfBlob.type && !pdfBlob.type.includes('pdf')) {
                throw new Error('The server did not return a PDF file.')
            }

            const url = window.URL.createObjectURL(pdfBlob)
            const link = document.createElement('a')

            link.href = url
            link.download = `interview_${interviewReportId}.pdf`

            document.body.appendChild(link)
            link.click()
            link.remove()

            // Revoke after the browser has started the download
            window.setTimeout(() => {
                window.URL.revokeObjectURL(url)
            }, 1000)

            return true
        } catch (err) {
            console.error('PDF download error:', err)

            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to download PDF.'
            )

            throw err
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    // Automatically load reports for the current route.
    // Interview.jsx should not call getReportById in another useEffect.
    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId).catch(() => {})
        } else {
            getReports().catch(() => {})
        }
    }, [interviewId, getReportById, getReports])

    return {
        loading,
        error,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    }
}
