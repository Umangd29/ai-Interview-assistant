
import React, { useState, useRef, useEffect } from 'react';
import '../style/home.scss';
import { useInterview } from '../hooks/useInterview.js';
import { useNavigate } from 'react-router';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB

const Home = () => {
    const { loading, generateReport, reports = [] } = useInterview();
    const [jobDescription, setJobDescription] = useState('');
    const [selfDescription, setSelfDescription] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState('');
    const [error, setError] = useState('');

    const resumeInputRef = useRef(null);
    const navigate = useNavigate();

    // Create and clean up the PDF preview URL
    useEffect(() => {
        if (!resumeFile) {
            setPdfUrl('');
            return;
        }

        const url = URL.createObjectURL(resumeFile);
        setPdfUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [resumeFile]);

    // Validate and select a PDF
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');

        const isPdf =
            file.type === 'application/pdf' ||
            file.name.toLowerCase().endsWith('.pdf');

        if (!isPdf) {
            setResumeFile(null);
            e.target.value = '';
            setError('Please upload a PDF file only.');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setResumeFile(null);
            e.target.value = '';
            setError('PDF size must not exceed 3 MB.');
            return;
        }

        setResumeFile(file);
    };

    // Remove selected PDF
    const handleRemoveFile = () => {
        setResumeFile(null);
        if (resumeInputRef.current) {
            resumeInputRef.current.value = '';
        }
    };

    // Generate interview report
    const handleGenerateReport = async () => {
        if (loading) return;

        if (!jobDescription.trim()) {
            setError('Please enter a job description.');
            return;
        }

        setError('');

        try {
            const data = await generateReport({
                jobDescription: jobDescription.trim(),
                selfDescription: selfDescription.trim(),
                resumeFile
            });

            if (!data?._id) {
                setError(
                    'Unable to generate your interview strategy. Please try again.'
                );
                return;
            }

            navigate(`/interview/${data._id}`);
        } catch (err) {
            console.error('Interview generation error:', err);
            setError(
                err?.response?.data?.message ||
                'Something went wrong while generating your interview. Please try again.'
            );
        }
    };

    if (loading) {
        return (
            <main className="loading-screen">
                <h1>Generating your interview plan...</h1>
            </main>
        );
    }

    return (
        <div className="home-page">
            {/* Page Header */}
            <header className="page-header">
                <span className="page-eyebrow">
                    AI-POWERED CAREER PREPARATION
                </span>
                <h1>
                    Create Your Custom{' '}
                    <span className="highlight">Interview Plan</span>
                </h1>
                <p>
                    Let our AI analyze the job requirements and your unique
                    profile to build a personalized interview strategy.
                </p>
            </header>

            {/* Main Card */}
            <div className="interview-card">
                <div className="interview-card__body">
                    {/* Left Panel - Job Description */}
                    <div className="panel panel--left">
                        <div className="panel__header">
                            <span className="panel__icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect
                                        x="2"
                                        y="7"
                                        width="20"
                                        height="14"
                                        rx="2"
                                        ry="2"
                                    />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                            </span>

                            <div className="panel__title">
                                <h2>Target Job Description</h2>
                                <p>Tell us about the role you're applying for.</p>
                            </div>

                            <span className="badge badge--required">
                                Required
                            </span>
                        </div>

                        <textarea
                            value={jobDescription}
                            onChange={(e) => {
                                setJobDescription(e.target.value);
                                if (error) setError('');
                            }}
                            className="panel__textarea"
                            placeholder={`Paste the full job description here...
e.g. Frontend Engineer requires proficiency in React, JavaScript, and system design...`}
                            maxLength={5000}
                        />

                        <div className="char-counter">
                            {jobDescription.length} / 5000 chars
                        </div>

                        {error && (
                            <p className="error-message" role="alert">
                                {error}
                            </p>
                        )}

                        <div className="panel-hint">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4M12 8h.01" />
                            </svg>
                            Include responsibilities, skills, and qualifications
                            for better results.
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="panel-divider" />

                    {/* Right Panel - Profile */}
                    <div className="panel panel--right">
                        <div className="panel__header">
                            <span className="panel__icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>

                            <div className="panel__title">
                                <h2>Your Profile</h2>
                                <p>Optionally share your experience.</p>
                            </div>
                        </div>

                        {/* Upload Resume */}
                        <div className="upload-section">
                            <label className="section-label" htmlFor="resume">
                                Upload Resume
                                <span className="badge badge--best">
                                    Optional
                                </span>
                            </label>

                            {!resumeFile && (
                                <label
                                    className="dropzone"
                                    htmlFor="resume"
                                >
                                    <span className="dropzone__icon">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="30"
                                            height="30"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="16 16 12 12 8 16" />
                                            <line
                                                x1="12"
                                                y1="12"
                                                x2="12"
                                                y2="21"
                                            />
                                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26 A8 8 0 1 0 3 16.3" />
                                        </svg>
                                    </span>

                                    <p className="dropzone__title">
                                        Click to upload
                                    </p>
                                    <p className="dropzone__subtitle">
                                        PDF only (Max 3 MB)
                                    </p>
                                </label>
                            )}

                            <input
                                ref={resumeInputRef}
                                hidden
                                type="file"
                                id="resume"
                                name="resume"
                                accept="application/pdf,.pdf"
                                onChange={handleFileChange}
                            />

                            {/* Selected PDF Details */}
                            {resumeFile && (
                                <div className="pdf-preview">
                                    <div className="pdf-preview__header">
                                        <div>
                                            <p className="pdf-preview__name">
                                                {resumeFile.name}
                                            </p>
                                            <p className="pdf-preview__size">
                                                {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="pdf-preview__remove"
                                            onClick={handleRemoveFile}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    {pdfUrl && (
                                        <iframe
                                            className="pdf-preview__frame"
                                            src={pdfUrl}
                                            title="Resume PDF Preview"
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* OR Divider */}
                        <div className="or-divider">
                            <span>OR</span>
                        </div>

                        {/* Quick Self-Description */}
                        <div className="self-description">
                            <label
                                className="section-label"
                                htmlFor="selfDescription"
                            >
                                Quick Self-Description
                                <span className="badge badge--best">
                                    Optional
                                </span>
                            </label>

                            <textarea
                                value={selfDescription}
                                onChange={(e) =>
                                    setSelfDescription(e.target.value)
                                }
                                id="selfDescription"
                                name="selfDescription"
                                className="panel__textarea panel__textarea--short"
                                placeholder="Briefly describe your experience, key skills, and goals..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className="info-box">
                            <span className="info-box__icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4M12 8h.01" />
                                </svg>
                            </span>
                            <p>
                                Resume and self-description are optional.
                                You can generate an interview strategy using
                                the job description alone.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className="interview-card__footer">
                    <span className="footer-info">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
                            <path d="m5.64 5.64 1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42m-9.88 9.88-1.42 1.42" />
                            <circle cx="12" cy="12" r="5" />
                        </svg>
                        AI-Powered Strategy Generation
                        <span className="footer-dot">•</span>
                        Approx. 30s
                    </span>

                    <button
                        type="button"
                        onClick={handleGenerateReport}
                        className="generate-btn"
                        disabled={loading}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>

                        {loading
                            ? 'Generating Interview...'
                            : 'Generate My Interview Strategy'}

                        {!loading && (
                            <span className="generate-btn__arrow">→</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className="recent-reports">
                    <div className="recent-reports__header">
                        <div>
                            <span className="page-eyebrow">
                                YOUR PROGRESS
                            </span>
                            <h2>My Recent Interview Plans</h2>
                            <p>
                                Continue working on your interview preparation.
                            </p>
                        </div>

                        <span className="reports-count">
                            {reports.length} Plans
                        </span>
                    </div>

                    <ul className="reports-list">
                        {reports.map((report) => (
                            <li
                                key={report._id}
                                className="report-item"
                                onClick={() =>
                                    navigate(`/interview/${report._id}`)
                                }
                            >
                                <div className="report-item__icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="21"
                                        height="21"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect
                                            x="4"
                                            y="3"
                                            width="16"
                                            height="18"
                                            rx="2"
                                        />
                                        <path d="M8 8h8M8 12h8M8 16h4" />
                                    </svg>
                                </div>

                                <div className="report-item__content">
                                    <h3>
                                        {report.title || 'Untitled Position'}
                                    </h3>
                                    <p className="report-meta">
                                        Generated on{' '}
                                        {new Date(
                                            report.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="report-item__right">
                                    <p
                                        className={`match-score ${
                                            report.matchScore >= 80
                                                ? 'score--high'
                                                : report.matchScore >= 60
                                                ? 'score--mid'
                                                : 'score--low'
                                        }`}
                                    >
                                        {report.matchScore}%
                                        <span>Match</span>
                                    </p>
                                    <span className="report-item__arrow">
                                        →
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className="page-footer">
                <span>
                    © {new Date().getFullYear()} Interview AI
                </span>
                <div className="page-footer__links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Help Center</a>
                </div>
            </footer>
        </div>
    );
};

export default Home;
