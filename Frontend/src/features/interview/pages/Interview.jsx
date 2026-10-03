import React, { useState } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'

// Navigation items
const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical Questions',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        )
    },
    {
        id: 'behavioral',
        label: 'Behavioral Questions',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        id: 'roadmap',
        label: 'Road Map',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        )
    }
]

// Individual question card
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    const toggleOpen = () => setOpen(prev => !prev)

    return (
        <div className="q-card">
            <div
                className="q-card__header"
                role="button"
                tabIndex={0}
                aria-expanded={open}
                onClick={toggleOpen}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggleOpen()
                    }
                }}
            >
                <span className="q-card__index">Q{index + 1}</span>

                <p className="q-card__question">
                    {item.question || 'Question unavailable'}
                </p>

                <span
                    className={`q-card__chevron ${
                        open ? 'q-card__chevron--open' : ''
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </div>

            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--intention">
                            Intention
                        </span>
                        <p>{item.intention || 'No intention provided.'}</p>
                    </div>

                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--answer">
                            Model Answer
                        </span>
                        <p>{item.answer || 'No model answer provided.'}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// Individual roadmap day
const RoadMapDay = ({ day }) => (
    <div className="roadmap-day">
        <div className="roadmap-day__header">
            <span className="roadmap-day__badge">
                Day {day.day}
            </span>

            <h3 className="roadmap-day__focus">
                {day.focus || 'Preparation'}
            </h3>
        </div>

        <ul className="roadmap-day__tasks">
            {(day.tasks ?? []).map((task, i) => (
                <li key={i}>
                    <span className="roadmap-day__bullet" />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')

    const {
        report,
        loading,
        error,
        getReportById
    } = useInterview()

    const { interviewId } = useParams()

    // Retry loading the interview report
    const handleRetry = async () => {
        if (!interviewId) return

        try {
            await getReportById(interviewId)
        } catch (err) {
            // The hook handles and stores the error.
            console.error('Failed to load interview report:', err)
        }
    }

    // Error screen
    if (error && !report) {
        return (
            <main className="loading-screen">
                <h1>{error}</h1>
                <button type="button" onClick={handleRetry}>
                    Try Again
                </button>
            </main>
        )
    }

    // Loading screen
    if (loading && !report) {
        return (
            <main className="loading-screen">
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    // No report found
    if (!report) {
        return (
            <main className="loading-screen">
                <h1>Interview report not found.</h1>
                <button type="button" onClick={handleRetry}>
                    Try Again
                </button>
            </main>
        )
    }

    // Safe fallbacks in case a report section is missing
    const technicalQuestions = report.technicalQuestions ?? []
    const behavioralQuestions = report.behavioralQuestions ?? []
    const preparationPlan = report.preparationPlan ?? []
    const skillGaps = report.skillGaps ?? []
    const matchScore = Number(report.matchScore) || 0

    const scoreColor =
        matchScore >= 80 ? 'score--high' :
        matchScore >= 60 ? 'score--mid' :
        'score--low'

    return (
        <div className="interview-page">
            <div className="interview-layout">

                {/* Left Navigation */}
                <nav className="interview-nav">
                    <div className="nav-content">
                        <p className="interview-nav__label">Sections</p>

                        {NAV_ITEMS.map(item => (
                            <button
                                type="button"
                                key={item.id}
                                className={`interview-nav__item ${
                                    activeNav === item.id
                                        ? 'interview-nav__item--active'
                                        : ''
                                }`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className="interview-nav__icon">
                                    {item.icon}
                                </span>
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/*
                    Temporarily disabled: PDF generation

                    <button
                        type="button"
                        className="button primary-button"
                        disabled
                    >
                        <svg
                            height="0.8rem"
                            style={{ marginRight: '0.8rem' }}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 19h14" />
                        </svg>
                        Download Resume
                    </button>
                    */}
                </nav>

                <div className="interview-divider" />

                {/* Center Content */}
                <main className="interview-content">

                    {/* Technical Questions */}
                    {activeNav === 'technical' && (
                        <section>
                            <div className="content-header">
                                <h2>Technical Questions</h2>
                                <span className="content-header__count">
                                    {technicalQuestions.length} questions
                                </span>
                            </div>

                            <div className="q-list">
                                {technicalQuestions.map((q, i) => (
                                    <QuestionCard
                                        key={q._id ?? i}
                                        item={q}
                                        index={i}
                                    />
                                ))}

                                {technicalQuestions.length === 0 && (
                                    <p>No technical questions available.</p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Behavioral Questions */}
                    {activeNav === 'behavioral' && (
                        <section>
                            <div className="content-header">
                                <h2>Behavioral Questions</h2>
                                <span className="content-header__count">
                                    {behavioralQuestions.length} questions
                                </span>
                            </div>

                            <div className="q-list">
                                {behavioralQuestions.map((q, i) => (
                                    <QuestionCard
                                        key={q._id ?? i}
                                        item={q}
                                        index={i}
                                    />
                                ))}

                                {behavioralQuestions.length === 0 && (
                                    <p>No behavioral questions available.</p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Preparation Roadmap */}
                    {activeNav === 'roadmap' && (
                        <section>
                            <div className="content-header">
                                <h2>Preparation Road Map</h2>
                                <span className="content-header__count">
                                    {preparationPlan.length}-day plan
                                </span>
                            </div>

                            <div className="roadmap-list">
                                {preparationPlan.map((day, i) => (
                                    <RoadMapDay
                                        key={day.day ?? i}
                                        day={day}
                                    />
                                ))}

                                {preparationPlan.length === 0 && (
                                    <p>No preparation plan available.</p>
                                )}
                            </div>
                        </section>
                    )}
                </main>

                <div className="interview-divider" />

                {/* Right Sidebar */}
                <aside className="interview-sidebar">

                    {/* Match Score */}
                    <div className="match-score">
                        <p className="match-score__label">Match Score</p>

                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className="match-score__value">
                                {matchScore}
                            </span>
                            <span className="match-score__pct">%</span>
                        </div>

                        <p className="match-score__sub">
                            Match score based on the provided information
                        </p>
                    </div>

                    <div className="sidebar-divider" />

                    {/* Skill Gaps */}
                    <div className="skill-gaps">
                        <p className="skill-gaps__label">Skill Gaps</p>

                        <div className="skill-gaps__list">
                            {skillGaps.map((gap, i) => (
                                <span
                                    key={gap._id ?? i}
                                    className={`skill-tag skill-tag--${gap.severity}`}
                                >
                                    {gap.skill}
                                </span>
                            ))}

                            {skillGaps.length === 0 && (
                                <p>No skill gaps available.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview