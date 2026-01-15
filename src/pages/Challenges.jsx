import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import API_URL from '../api';
import { useAuth } from '../context/AuthContext';
import {
    FaBiking, FaPlug, FaShoppingBag, FaLeaf, FaMedal, FaRocket, FaStar, FaBolt, FaGlobeAmericas, FaCheckCircle, FaBuilding, FaUsers, FaGraduationCap, FaShareAlt, FaTimes
} from 'react-icons/fa';
import './Challenges.css';

export default function Challenges() {
    const { t } = useLanguage();
    const [challenges, setChallenges] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    // Quiz System State
    const [inQuizMode, setInQuizMode] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState([]);
    const [quizResult, setQuizResult] = useState(null);
    const [currentQIndex, setCurrentQIndex] = useState(0); // For step-by-step

    // Modal State
    const [selectedMission, setSelectedMission] = useState(null);
    const [proofFile, setProofFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [shareModal, setShareModal] = useState(null); // { type: 'quiz'|'mission', data: ... }
    const [shareMessage, setShareMessage] = useState('');

    const { user, isAuthenticated, updatePoints } = useAuth();

    // User level calculation
    const userPoints = user?.points || 0;
    const currentLevel = Math.floor(userPoints / 500) + 1;
    const nextLevelPoints = currentLevel * 500;
    const progressPercent = Math.min(100, Math.floor((userPoints / nextLevelPoints) * 100));

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const token = localStorage.getItem('token');
                const [cRes, qRes] = await Promise.all([
                    fetch(`${API_URL}/api/challenges`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_URL}/api/quizzes`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (cRes.ok) setChallenges(await cRes.json());
                if (qRes.ok) {
                    const qData = await qRes.json();
                    console.log('Quizzes received:', qData);
                    setQuizzes(qData);
                } else {
                    console.error('Failed to fetch quizzes:', qRes.status);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMissions();
    }, []);

    // Filter Logic
    const filteredChallenges = filter === 'all'
        ? challenges
        : challenges.filter(c => c.category === filter);

    const getDifficultyColor = (level) => {
        switch (level) {
            case 'easy': return 'easy';
            case 'medium': return 'medium';
            case 'hard': return 'hard';
            default: return 'easy';
        }
    };

    const getDifficultyLabel = (level) => {
        switch (level) {
            case 'easy': return t('chal_diff_easy');
            case 'medium': return t('chal_diff_medium');
            case 'hard': return t('chal_diff_hard');
            default: return t('chal_diff_easy');
        }
    };

    // Icon mapping helper
    const getIcon = (cat) => {
        switch (cat) {
            case 'transporte': return <FaBiking />;
            case 'hogar': return <FaPlug />;
            case 'consumo': return <FaShoppingBag />;
            case 'educacion': return <FaGraduationCap />;
            case 'social': return <FaUsers />;
            case 'empresa': return <FaBuilding />;
            default: return <FaLeaf />;
        }
    };

    // Helper: File to Base64
    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleShareAchievement = async () => {
        if (!shareModal) return;

        try {
            const token = localStorage.getItem('token');
            let payload = {
                type: 'challenge_repost',
                challengeTitle: shareModal.title,
                challengeDescription: shareModal.description,
                challengeCategory: shareModal.category,
                message: shareMessage || (shareModal.type === 'quiz' ? t('chal_quiz_success') : t('chal_mission_completed')),
                verifType: shareModal.verification_type,
                points: shareModal.points
            };

            if (shareModal.type === 'quiz') {
                payload.record = `${shareModal.score}/${shareModal.total}`;
            } else if (shareModal.type === 'mission') {
                if (shareModal.verification_type === 'link') {
                    payload.link = shareModal.proof;
                } else if (shareModal.verification_type === 'photo' && shareModal.proofFile) {
                    // Convert file to base64
                    payload.image = await fileToBase64(shareModal.proofFile);
                }
            }

            console.log('Sending share payload:', payload);

            const res = await fetch(`${API_URL}/api/community/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: JSON.stringify(payload) })
            });

            if (res.ok) {
                console.log("Share successful");
                alert(t('chal_share_success'));
                setShareModal(null);
                setShareMessage('');
            } else {
                const errText = await res.text();
                console.error("Share failed", errText);
                alert(t('chal_share_error') + ": " + errText);
            }
        } catch (error) {
            console.error("Error sharing:", error);
            alert(t('chal_share_connection_error'));
        }
    };

    // Quiz Helper Functions
    const formatUnlocksIn = (ms) => {
        const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
        return `${t('chal_quiz_unlocks')} ${days} days`;
    };

    const handleStartQuiz = (quiz) => {
        if (quiz.status === 'locked') return;
        setActiveQuiz(quiz);
        setQuizAnswers(new Array(quiz.questions.length).fill(null));
        setQuizResult(null);
        setCurrentQIndex(0);
    };

    const handleAnswerQuiz = (qIdx, oIdx) => {
        setQuizAnswers(prev => {
            const newAns = [...prev];
            newAns[qIdx] = oIdx;
            return newAns;
        });

        // Auto-advance after small delay
        setTimeout(() => {
            if (currentQIndex < activeQuiz.questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
            }
        }, 400);
    };

    const handleSubmitQuiz = async () => {
        console.log("Submit Quiz Clicked. Answers:", quizAnswers);
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/quizzes/${activeQuiz.id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ answers: quizAnswers })
            });

            console.log("Submit Response Status:", res.status);

            if (res.ok) {
                const result = await res.json();
                console.log("Submit Result:", result);
                setQuizResult(result);
                setShowSuccess(true); // Trigger success view

                // Add to share queue
                if (result.success) {
                    setShareModal({
                        type: 'quiz',
                        title: activeQuiz.title,
                        description: activeQuiz.description,
                        category: 'education', // Quizzes usually education
                        score: result.score,
                        total: result.total,
                        points: result.pointsAwarded,
                        verification_type: 'quiz'
                    });
                    setShareMessage(t('chal_quiz_success'));
                }

                // Refresh quizzes to update status
                const qRes = await fetch(`${API_URL}/api/quizzes`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (qRes.ok) setQuizzes(await qRes.json());

                // If passed, update user points locally too
                if (result.success) {
                    if (result.pointsAwarded > 0) {
                        await updatePoints(userPoints + result.pointsAwarded);
                    }

                    // Update the challenge status in the main grid immediately
                    if (selectedMission) {
                        setChallenges(prev => prev.map(c =>
                            c.id === selectedMission.id ? { ...c, status: 'approved' } : c
                        ));
                    }
                }
            } else {
                console.error("Submit failed with status:", res.status);
            }
        } catch (err) {
            console.error("Submit Error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '10rem' }}><h1>{t('chal_loading')}</h1></div>;

    if (inQuizMode) {
        return (
            <div className="container fade-in" style={{ padding: '2rem 1rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={() => { setInQuizMode(false); setActiveQuiz(null); }}>← {t('chal_btn_back')}</button>
                    <h1>{t('chal_quiz_weekly')}</h1>
                </div>

                {!activeQuiz ? (
                    <div className="quiz-dashboard-glass">
                        <h2>{t('chal_quiz_progress')}</h2>
                        <p style={{ marginBottom: '2rem', color: '#64748b' }}>{t('chal_quiz_desc')}</p>

                        <div className="quiz-path">
                            {quizzes.map((q, idx) => (
                                <div key={q.id} className="quiz-node-container">
                                    <div
                                        className={`quiz-node ${q.status}`}
                                        onClick={() => handleStartQuiz(q)}
                                        title={q.status === 'locked' ? formatUnlocksIn(q.unlocks_in) : q.title}
                                    >
                                        <div className="node-icon">
                                            {q.status === 'completed' ? <FaCheckCircle /> : (q.status === 'locked' ? '🔒' : <FaBolt />)}
                                        </div>
                                        <div className="node-label">{t('chal_quiz_level')} {idx + 1}</div>
                                    </div>
                                    {idx < quizzes.length - 1 && <div className={`node-connector ${quizzes[idx + 1].status !== 'locked' ? 'active' : ''}`}></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="quiz-interface-glass">
                        {quizResult ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <FaMedal style={{ fontSize: '5rem', color: quizResult.success ? '#fbbf24' : '#94a3b8', marginBottom: '1.5rem' }} />
                                <h2>{quizResult.success ? t('chal_quiz_success') : t('chal_quiz_almost')}</h2>
                                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{t('chal_quiz_score')}: {quizResult.score} / {quizResult.total}</p>
                                <button className="btn-primary" onClick={() => { setActiveQuiz(null); setInQuizMode(false); }}>{t('chal_modal_confirm')}</button>

                                <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', textAlign: 'left' }}>
                                    <p style={{ marginBottom: '0.8rem', fontSize: '0.95rem', color: '#64748b', fontWeight: '500' }}>{t('chal_quiz_share_title')}</p>
                                    <textarea
                                        value={shareMessage}
                                        onChange={e => setShareMessage(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '12px',
                                            border: '1px solid #cbd5e1',
                                            marginBottom: '1rem',
                                            resize: 'none',
                                            fontFamily: 'inherit',
                                            fontSize: '0.95rem'
                                        }}
                                        rows={2}
                                        placeholder={`${t('chal_quiz_success')} 🎓`}
                                    />
                                    <button className="btn-share-gold" onClick={handleShareAchievement}>
                                        <FaShareAlt /> {t('chal_quiz_share_btn')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="quiz-q-header">
                                    <h3>{activeQuiz.title}</h3>
                                    <p>{activeQuiz.description}</p>
                                </div>
                                <div className="quiz-questions">
                                    {activeQuiz.questions.map((q, qIdx) => (
                                        <div key={qIdx} className="q-card">
                                            <p className="q-text">{qIdx + 1}. {q.question}</p>
                                            <div className="q-options">
                                                {q.options.map((opt, oIdx) => (
                                                    <button
                                                        key={oIdx}
                                                        className={`opt-btn ${quizAnswers[qIdx] === oIdx ? 'selected' : ''}`}
                                                        onClick={() => handleAnswerQuiz(qIdx, oIdx)}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                                    <button
                                        className="btn-mission"
                                        onClick={handleSubmitQuiz}
                                        disabled={quizAnswers.includes(null) || isSubmitting}
                                    >
                                        {isSubmitting ? t('chal_quiz_verifying') : t('chal_quiz_finish')}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    }

    const handleOpenMission = (challenge) => {
        console.log("Handle Open Mission Clicked:", challenge);
        if (challenge.status === 'approved') return;

        // Robust check for quiz type
        const isQuiz = challenge.verification_type === 'quiz' ||
            challenge.title.toLowerCase().includes('quiz');

        if (isQuiz) {
            console.log("Preparing Quiz Modal for challenge:", challenge.title, "Quizzes Available:", quizzes.length);

            if (!quizzes || quizzes.length === 0) {
                console.error("No quizzes available to load!");
                // Fallback or show error? For now, we open modal but maybe set a flag
            } else {
                // Find the first unlocked or next quiz
                // We assume quizzes are sorted by order_index
                let nextQuiz = quizzes.find(q => q.status === 'unlocked') ||
                    quizzes.find(q => q.status !== 'completed') ||
                    quizzes[quizzes.length - 1];

                // If the found quiz is locked (e.g. waiting period), show the previous completed one to avoid empty modal
                if (nextQuiz && nextQuiz.status === 'locked') {
                    const currentIndex = quizzes.indexOf(nextQuiz);
                    if (currentIndex > 0) {
                        nextQuiz = quizzes[currentIndex - 1];
                    }
                }

                if (nextQuiz) {
                    console.log("Starting quiz:", nextQuiz.title, "Status:", nextQuiz.status);
                    handleStartQuiz(nextQuiz);
                } else {
                    console.error("Could not determine active quiz");
                }
            }
        }

        console.log("Opening Modal");
        setSelectedMission(challenge);
        setProofFile(null);
        setShowSuccess(false);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProofFile(e.target.files[0]);
        }
    };

    const handleSubmitMission = async () => {
        if (!selectedMission) return;

        // Validation
        if (selectedMission.verification_type === 'link') {
            if (!proofFile || typeof proofFile !== 'string' || proofFile.length < 5) return;
        }
        if (selectedMission.verification_type === 'photo') {
            if (!proofFile) return;
        }

        setIsSubmitting(true);
        try {
            // Simulate AI Analysis time
            await new Promise(r => setTimeout(r, 2000));

            const token = localStorage.getItem('token');

            // Prepare proof content
            let contentToSend = 'auto_verified';
            if (selectedMission.verification_type === 'link') contentToSend = proofFile;
            if (selectedMission.verification_type === 'photo') contentToSend = proofFile.name || 'photo_upload';

            const res = await fetch(`${API_URL}/api/challenges/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    challengeId: selectedMission.id,
                    proofContent: contentToSend
                })
            });

            if (res.ok) {
                const data = await res.json();
                setShowSuccess(true);

                // Add to share queue
                setShareModal({
                    type: 'mission',
                    title: selectedMission.title,
                    description: selectedMission.description,
                    category: selectedMission.category,
                    points: selectedMission.points,
                    verification_type: selectedMission.verification_type,
                    proof: selectedMission.verification_type === 'link' ? proofFile : null,
                    proofFile: selectedMission.verification_type === 'photo' ? proofFile : null
                });
                setShareMessage(t('chal_share_msg'));

                setChallenges(prev => prev.map(c =>
                    c.id === selectedMission.id ? { ...c, status: 'approved' } : c
                ));
                await updatePoints(userPoints + selectedMission.points);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="container fade-in" style={{ padding: '2rem 1rem' }}>

            {/* ... Dashboard ... */}
            <div className="mission-dashboard">
                <div className="dashboard-glass">
                    <div className="dash-profile">
                        <div className="avatar-circle">
                            <FaRocket />
                        </div>
                        <div className="dash-info">
                            <span className="dash-label">{t('chal_dash_cadet')}</span>
                            <h2>{user?.username || 'Explorador'}</h2>
                        </div>
                    </div>

                    <div className="dash-stats">
                        <div className="stat-item">
                            <FaStar className="stat-icon" />
                            <div>
                                <span className="stat-val">{userPoints}</span>
                                <span className="stat-label">{t('prof_stat_xp')}</span>
                            </div>
                        </div>
                        <div className="stat-item">
                            <FaMedal className="stat-icon" />
                            <div>
                                <span className="stat-val">{t('chal_quiz_level')} {currentLevel}</span>
                                <span className="stat-label">{t('chal_dash_rank')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="dash-progress">
                        <div className="progress-labels">
                            <span>{t('chal_dash_level_progress')}</span>
                            <span>{userPoints} / {nextLevelPoints} XP</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="challenges-header">
                <h1>{t('chal_mission_center')}</h1>
                <p>{t('chal_mission_desc')}</p>
            </div>

            {/* Filters */}
            <div className="filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                    {t('chal_filter_all')}
                </button>
                <button className={`filter-btn ${filter === 'transporte' ? 'active' : ''}`} onClick={() => setFilter('transporte')}>
                    <FaBiking className="btn-icon" /> {t('chal_filter_transport')}
                </button>
                <button className={`filter-btn ${filter === 'hogar' ? 'active' : ''}`} onClick={() => setFilter('hogar')}>
                    <FaPlug className="btn-icon" /> {t('chal_filter_home')}
                </button>
                <button className={`filter-btn ${filter === 'consumo' ? 'active' : ''}`} onClick={() => setFilter('consumo')}>
                    <FaShoppingBag className="btn-icon" /> {t('chal_filter_consumption')}
                </button>
                <button className={`filter-btn ${filter === 'educacion' ? 'active' : ''}`} onClick={() => setFilter('educacion')}>
                    <FaGraduationCap className="btn-icon" /> {t('chal_filter_education')}
                </button>
                <button className={`filter-btn ${filter === 'social' ? 'active' : ''}`} onClick={() => setFilter('social')}>
                    <FaUsers className="btn-icon" /> {t('chal_filter_social')}
                </button>
                <button className={`filter-btn ${filter === 'empresa' ? 'active' : ''}`} onClick={() => setFilter('empresa')}>
                    <FaBuilding className="btn-icon" /> {t('chal_filter_company')}
                </button>
            </div>

            {/* MISSIONS GRID */}
            <div className="grid-3">
                {filteredChallenges.map(challenge => {
                    const diffColor = getDifficultyColor(challenge.level);
                    const isCompleted = challenge.status === 'approved';

                    return (
                        <div key={challenge.id} className={`mission-card ${isCompleted ? 'accepted-pulse' : ''}`} style={{ borderColor: isCompleted ? '#10b981' : 'transparent' }}>

                            {isCompleted && (
                                <div className="mission-overlay">
                                    <FaCheckCircle className="success-icon" />
                                    <span>{t('chal_completed_msg')}</span>
                                </div>
                            )}

                            <div className="mission-header">
                                <div className={`mission-icon-circle cat-${challenge.category}`} style={{ background: isCompleted ? '#ecfdf5' : '' }}>
                                    {getIcon(challenge.category)}
                                </div>
                                <div className="mission-points">
                                    <FaBolt /> {challenge.points} XP
                                </div>
                            </div>

                            <div className="mission-body" style={{ minHeight: '120px' }}>
                                <h3>{challenge.title}</h3>
                                <p style={{ fontSize: '0.9rem' }}>{challenge.description}</p>
                            </div>

                            <div className="mission-footer">
                                <div className="mission-meta">
                                    <span className={`difficulty-dot ${diffColor}`}></span>
                                    {getDifficultyLabel(challenge.level)}
                                </div>
                                <button
                                    className="btn-mission"
                                    onClick={() => handleOpenMission(challenge)}
                                    disabled={isCompleted}
                                    style={{ background: isCompleted ? '#10b981' : '' }}
                                >
                                    {isCompleted ? t('chal_completed_msg') : t('chal_btn_accept')}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>


            {/* MODAL */}
            {selectedMission && (
                <div className="modal-overlay" onClick={() => !isSubmitting && setSelectedMission(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {!showSuccess ? (
                            <>
                                {selectedMission.verification_type === 'quiz' && activeQuiz ? (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h2 style={{ marginBottom: '0.2rem', fontSize: '1.4rem' }}>{activeQuiz.title}</h2>
                                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{activeQuiz.description}</p>
                                    </div>
                                ) : (
                                    <h2 style={{ marginBottom: '0.5rem' }}>{selectedMission.title}</h2>
                                )}

                                {/* Quiz Logic */}
                                {selectedMission.verification_type === 'quiz' && activeQuiz ? (
                                    <div className="quiz-modal-container">
                                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#475569' }}>{activeQuiz.title}</h3>
                                            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{activeQuiz.description}</p>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="quiz-progress-container" style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                                                <span>Pregunta {currentQIndex + 1} de {activeQuiz.questions.length}</span>
                                                <span>{Math.round(((currentQIndex + 1) / activeQuiz.questions.length) * 100)}%</span>
                                            </div>
                                            <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                                                <div style={{
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                                                    width: `${((currentQIndex + 1) / activeQuiz.questions.length) * 100}%`,
                                                    transition: 'width 0.4s ease'
                                                }}></div>
                                            </div>
                                        </div>

                                        <div className="quiz-question-step fade-in-slide" key={currentQIndex}>
                                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#1e293b' }}>
                                                {activeQuiz.questions[currentQIndex].question}
                                            </h3>

                                            <div className="q-options" style={{ display: 'grid', gap: '0.8rem' }}>
                                                {activeQuiz.questions[currentQIndex].options.map((opt, oIdx) => {
                                                    const isSelected = quizAnswers[currentQIndex] === oIdx;
                                                    return (
                                                        <button
                                                            key={oIdx}
                                                            className={`opt-btn ${isSelected ? 'selected' : ''}`}
                                                            onClick={() => handleAnswerQuiz(currentQIndex, oIdx)}
                                                            style={{
                                                                padding: '1rem',
                                                                borderRadius: '12px',
                                                                border: isSelected ? '2px solid var(--color-primary)' : '1px solid #cbd5e1',
                                                                background: isSelected ? '#f5f3ff' : 'white',
                                                                color: isSelected ? 'var(--color-primary)' : '#475569',
                                                                fontWeight: isSelected ? '600' : '400',
                                                                cursor: 'pointer',
                                                                textAlign: 'left',
                                                                transition: 'all 0.2s',
                                                                position: 'relative',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            {opt}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="modal-actions" style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                                            <button className="btn btn-secondary" onClick={() => setSelectedMission(null)}>{t('chal_modal_cancel')}</button>
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleSubmitQuiz}
                                                disabled={quizAnswers.includes(null) || isSubmitting}
                                            >
                                                {isSubmitting ? t('chal_quiz_verifying') : t('chal_quiz_finish')}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Standard Mission Logic */
                                    <>
                                        <p style={{ marginBottom: '2rem', color: '#64748b', fontSize: '1rem', lineHeight: '1.6' }}>
                                            {selectedMission.verification_type === 'link' ? 'Comparte el enlace para verificar tu misión.' :
                                                selectedMission.verification_type === 'photo' ? 'Sube una foto. Nuestra IA analizará si cumple el objetivo.' :
                                                    'Confirma que has realizado esta acción.'}
                                        </p>

                                        {selectedMission.verification_type === 'photo' && (
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                {proofFile ? (
                                                    <div className="preview-container">
                                                        <img
                                                            src={URL.createObjectURL(proofFile)}
                                                            alt="Preview"
                                                            className="preview-img"
                                                        />
                                                        <button
                                                            className="remove-img-btn"
                                                            onClick={() => setProofFile(null)}
                                                        >
                                                            <FaGlobeAmericas style={{ fontSize: '1.2rem', transform: 'rotate(45deg)' }} />
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="upload-zone">
                                                        <div className="upload-icon">📷</div>
                                                        <div style={{ fontWeight: '600', color: '#475569', fontSize: '1.1rem' }}>{t('chal_modal_upload_photo')}</div>
                                                        <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.5rem' }}>JPG, PNG (Max 5MB)</div>
                                                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                                    </label>
                                                )}
                                            </div>
                                        )}

                                        {selectedMission.verification_type === 'link' && (
                                            <div className="link-input-group" style={{ marginBottom: '1.5rem' }}>
                                                <label>{t('chal_modal_link_evidence')}</label>
                                                <input
                                                    type="url"
                                                    className="link-input"
                                                    placeholder="https://ejemplo.com/evidencia"
                                                    value={typeof proofFile === 'string' ? proofFile : ''}
                                                    onChange={(e) => setProofFile(e.target.value)}
                                                />
                                            </div>
                                        )}

                                        {isSubmitting ? (
                                            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                                <div className="spinner"></div>
                                                <h3 className="analyzing-text">{t('chal_modal_analyzing')}</h3>
                                                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Verificando tu evidencia en tiempo real</p>
                                            </div>
                                        ) : (
                                            <div className="modal-actions">
                                                <button className="btn btn-secondary" onClick={() => setSelectedMission(null)}>{t('chal_modal_cancel')}</button>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={handleSubmitMission}
                                                    disabled={
                                                        (selectedMission.verification_type === 'photo' && !proofFile) ||
                                                        (selectedMission.verification_type === 'link' && (!proofFile || proofFile.length < 5))
                                                    }
                                                >
                                                    {selectedMission.verification_type === 'auto' ? t('chal_modal_confirm') : t('chal_modal_send_evidence')}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div className="success-animation">
                                    <FaCheckCircle style={{ fontSize: '5rem', color: '#10b981', filter: 'drop-shadow(0 10px 20px rgba(16,185,129,0.4))' }} />
                                </div>
                                <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>
                                    {quizResult && quizResult.pointsAwarded === 0 ? "¡Buen Intento!" :
                                        quizResult && quizResult.score === quizResult.total ? "¡Excelente!" : "¡Bien Hecho!"}
                                </h2>

                                {quizResult ? (
                                    <>
                                        <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                            Has acertado <strong style={{ color: '#3b82f6' }}>{quizResult.score}/{quizResult.total}</strong> preguntas.
                                        </p>
                                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                                            <p style={{ margin: 0, fontWeight: '600', color: '#0369a1' }}>
                                                {quizResult.score === quizResult.total
                                                    ? "¡Increíble! Eres un experto en la capa de ozono. 🌟"
                                                    : quizResult.score > quizResult.total / 2
                                                        ? "¡Buen trabajo! Vas por buen camino. 👍"
                                                        : "Sigue aprendiendo, ¡la próxima será perfecta! 💪"}
                                            </p>
                                        </div>
                                        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                                            Has ganado <strong style={{ color: '#f59e0b', fontSize: '1.2rem' }}>{quizResult.pointsAwarded} XP</strong>
                                        </p>
                                    </>
                                ) : (
                                    <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.1rem' }}>
                                        {t('chal_completed_msg')} <strong style={{ color: '#f59e0b', fontSize: '1.2rem' }}>{selectedMission.points} XP</strong>
                                    </p>
                                )}

                                <button className="btn btn-primary" onClick={() => { setSelectedMission(null); setShowSuccess(false); setQuizResult(null); setShareModal(null); }}>{t('chal_modal_continue')}</button>

                                {shareModal && (
                                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                                        <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>{t('chal_quiz_share_title')}</p>
                                        <textarea
                                            value={shareMessage}
                                            onChange={e => setShareMessage(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                marginBottom: '1rem',
                                                resize: 'none',
                                                fontFamily: 'inherit'
                                            }}
                                            rows={2}
                                            placeholder={`${t('chal_quiz_success')} 🎓`}
                                        />
                                        <button className="btn-share-gold" onClick={handleShareAchievement}>
                                            <FaShareAlt /> {t('chal_quiz_share_btn')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}


        </div>
    );
}
