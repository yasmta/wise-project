import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
    FaBiking, FaPlug, FaShoppingBag, FaLeaf, FaMedal, FaRocket, FaStar, FaBolt, FaGlobeAmericas, FaCheckCircle, FaBuilding, FaUsers, FaGraduationCap
} from 'react-icons/fa';
import './Challenges.css';

export default function Challenges() {
    const [challenges, setChallenges] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    // Quiz System State
    const [inQuizMode, setInQuizMode] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState([]);
    const [quizResult, setQuizResult] = useState(null);

    // Modal State
    const [selectedMission, setSelectedMission] = useState(null);
    const [proofFile, setProofFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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
                    fetch('http://localhost:3001/api/challenges', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('http://localhost:3001/api/quizzes', { headers: { 'Authorization': `Bearer ${token}` } })
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
            case 'easy': return 'Fácil';
            case 'medium': return 'Medio';
            case 'hard': return 'Difícil';
            default: return 'Fácil';
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

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '10rem' }}><h1>Cargando Misiones...</h1></div>;

    if (inQuizMode) {
        return (
            <div className="container fade-in" style={{ padding: '2rem 1rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={() => { setInQuizMode(false); setActiveQuiz(null); }}>← Volver</button>
                    <h1>Quizzes Semanales</h1>
                </div>

                {!activeQuiz ? (
                    <div className="quiz-dashboard-glass">
                        <h2>Tu Progreso de Entrenamiento</h2>
                        <p style={{ marginBottom: '2rem', color: '#64748b' }}>Completa un quiz cada 4 días para desbloquear el siguiente nivel de conocimiento.</p>

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
                                        <div className="node-label">Nivel {idx + 1}</div>
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
                                <h2>{quizResult.success ? '¡Excelente Trabajo!' : 'Casi lo tienes...'}</h2>
                                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Puntuación: {quizResult.score} / {quizResult.total}</p>
                                <button className="btn-primary" onClick={() => { setActiveQuiz(null); setInQuizMode(false); }}>Cerrar</button>
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
                                        {isSubmitting ? 'Verificando...' : 'Finalizar Entrenamiento'}
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
        if (challenge.status === 'approved') return;
        if (challenge.verification_type === 'quiz') {
            setInQuizMode(true);
            return;
        }
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
        if (selectedMission.verification_type !== 'auto' && !proofFile && selectedMission.verification_type !== 'link' && selectedMission.verification_type !== 'quiz') {
            if (selectedMission.verification_type === 'photo' && !proofFile) return;
        }

        setIsSubmitting(true);
        try {
            await new Promise(r => setTimeout(r, 1500));

            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3001/api/challenges/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    challengeId: selectedMission.id,
                    proofContent: 'mock_proof_blob'
                })
            });

            if (res.ok) {
                const data = await res.json();
                setShowSuccess(true);

                setChallenges(prev => prev.map(c =>
                    c.id === selectedMission.id ? { ...c, status: 'approved' } : c
                ));
                await updatePoints(userPoints + selectedMission.points);

                setTimeout(() => {
                    setSelectedMission(null);
                    setShowSuccess(false);
                }, 2000);
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
                            <span className="dash-label">Cadete Espacial</span>
                            <h2>{user?.username || 'Explorador'}</h2>
                        </div>
                    </div>

                    <div className="dash-stats">
                        <div className="stat-item">
                            <FaStar className="stat-icon" />
                            <div>
                                <span className="stat-val">{userPoints}</span>
                                <span className="stat-label">XP Total</span>
                            </div>
                        </div>
                        <div className="stat-item">
                            <FaMedal className="stat-icon" />
                            <div>
                                <span className="stat-val">Nvl {currentLevel}</span>
                                <span className="stat-label">Rango</span>
                            </div>
                        </div>
                    </div>

                    <div className="dash-progress">
                        <div className="progress-labels">
                            <span>Progreso de Nivel</span>
                            <span>{userPoints} / {nextLevelPoints} XP</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="challenges-header">
                <h1>Centro de Misiones</h1>
                <p>Completa objetivos estratégicos para salvar la capa de ozono y ganar XP.</p>
            </div>

            {/* Filters */}
            <div className="filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                    Todas
                </button>
                <button className={`filter-btn ${filter === 'transporte' ? 'active' : ''}`} onClick={() => setFilter('transporte')}>
                    <FaBiking className="btn-icon" /> Transporte
                </button>
                <button className={`filter-btn ${filter === 'hogar' ? 'active' : ''}`} onClick={() => setFilter('hogar')}>
                    <FaPlug className="btn-icon" /> Hogar
                </button>
                <button className={`filter-btn ${filter === 'consumo' ? 'active' : ''}`} onClick={() => setFilter('consumo')}>
                    <FaShoppingBag className="btn-icon" /> Consumo
                </button>
                <button className={`filter-btn ${filter === 'educacion' ? 'active' : ''}`} onClick={() => setFilter('educacion')}>
                    <FaGraduationCap className="btn-icon" /> Educación
                </button>
                <button className={`filter-btn ${filter === 'social' ? 'active' : ''}`} onClick={() => setFilter('social')}>
                    <FaUsers className="btn-icon" /> Social
                </button>
                <button className={`filter-btn ${filter === 'empresa' ? 'active' : ''}`} onClick={() => setFilter('empresa')}>
                    <FaBuilding className="btn-icon" /> Empresa
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
                                    <span>¡Misión Cumplida!</span>
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
                                    {isCompleted ? 'Completado' : 'Iniciar Misión'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>


            {/* MODAL */}
            {selectedMission && (
                <div className="modal-overlay" onClick={() => setSelectedMission(null)}>
                    <div className="modal-content zoom-in" onClick={e => e.stopPropagation()} style={{ background: 'white', color: '#1e293b' }}>
                        {!showSuccess ? (
                            <>
                                <h2 style={{ marginBottom: '0.5rem' }}>{selectedMission.title}</h2>
                                <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
                                    {selectedMission.verification_type === 'quiz' ? 'Completa el quiz para verificar.' : 'Sube tu evidencia para que la IA la verifique.'}
                                </p>

                                {selectedMission.verification_type === 'photo' && (
                                    <label style={{ display: 'block', padding: '2rem', border: '2px dashed #cbd5e1', borderRadius: '1rem', textAlign: 'center', cursor: 'pointer', marginBottom: '1.5rem' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                                        <div>{proofFile ? proofFile.name : 'Subir Foto'}</div>
                                        <input type="file" hidden onChange={handleFileChange} />
                                    </label>
                                )}

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button className="btn-secondary" onClick={() => setSelectedMission(null)}>Cancelar</button>
                                    <button
                                        className="btn-primary"
                                        onClick={handleSubmitMission}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Verificando IA...' : 'Enviar'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <FaCheckCircle style={{ fontSize: '4rem', color: '#10b981', marginBottom: '1rem' }} />
                                <h2>¡Excelente!</h2>
                                <p>Has ganado {selectedMission.points} XP</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
