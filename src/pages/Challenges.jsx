import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
    FaBiking, FaPlug, FaShoppingBag, FaLeaf, FaMedal, FaRocket, FaStar, FaBolt, FaGlobeAmericas, FaCheckCircle
} from 'react-icons/fa';
import './Challenges.css';

export default function Challenges() {
    const [filter, setFilter] = useState('all');
    const [acceptedMissions, setAcceptedMissions] = useState({});
    const { t } = useLanguage();
    const { user, isAuthenticated, updatePoints } = useAuth();

    // Mock user level calculation
    const userPoints = user?.points || 0;
    const currentLevel = Math.floor(userPoints / 500) + 1;
    const nextLevelPoints = currentLevel * 500;
    const progressPercent = Math.min(100, Math.floor((userPoints / nextLevelPoints) * 100));

    const challenges = [
        {
            id: 1,
            title: t('chal_c1_title'),
            description: t('chal_c1_desc'),
            category: 'transporte',
            difficulty: t('chal_diff_medium'),
            points: 50,
            icon: <FaBiking />,
            impact: "Ahorra 2kg CO2",
            type: "daily"
        },
        {
            id: 2,
            title: t('chal_c2_title'),
            description: t('chal_c2_desc'),
            category: 'hogar',
            difficulty: t('chal_diff_easy'),
            points: 20,
            icon: <FaPlug />,
            impact: "Ahorra Energía",
            type: "daily"
        },
        {
            id: 3,
            title: t('chal_c3_title'),
            description: t('chal_c3_desc'),
            category: 'consumo',
            difficulty: t('chal_diff_hard'),
            points: 100,
            icon: <FaShoppingBag />,
            impact: "Apoyo Local",
            type: "weekly"
        },
        {
            id: 4,
            title: t('chal_c4_title'),
            description: t('chal_c4_desc'),
            category: 'hogar',
            difficulty: t('chal_diff_easy'),
            points: 30,
            icon: <FaLeaf />,
            impact: "Menos Residuos",
            type: "daily"
        },
    ];

    const filteredChallenges = filter === 'all'
        ? challenges
        : challenges.filter(c => c.category === filter);

    const handleAcceptMission = async (id, points) => {
        if (!isAuthenticated) {
            alert(t('auth_login_required') || 'Please login to earn points');
            return;
        }

        // Simulating visual feedback
        setAcceptedMissions(prev => ({ ...prev, [id]: true }));

        // Add points
        const newTotal = userPoints + points;
        try {
            await updatePoints(newTotal);
            // Reset accepted state after animation (2s)
            setTimeout(() => {
                setAcceptedMissions(prev => ({ ...prev, [id]: false }));
            }, 2000);
        } catch (error) {
            console.error('Error updating points', error);
        }
    };

    return (
        <div className="container fade-in" style={{ padding: '2rem 1rem' }}>

            {/* 1. HERO STATS DASHBOARD (Mission Control) */}
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
                <p>Selecciona tus objetivos para hoy y contribuye a la recuperación global.</p>
            </div>

            {/* Filters */}
            <div className="filter-bar">
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
            </div>

            {/* 3. MISSIONS GRID */}
            <div className="grid-3">
                {filteredChallenges.map(challenge => (
                    <div key={challenge.id} className={`mission-card ${acceptedMissions[challenge.id] ? 'accepted-pulse' : ''}`}>

                        {/* Status Badge (accepted?) */}
                        {acceptedMissions[challenge.id] && (
                            <div className="mission-overlay">
                                <FaCheckCircle className="success-icon" />
                                <span>¡Misión Cumplida!</span>
                            </div>
                        )}

                        <div className="mission-header">
                            <div className={`mission-icon-circle cat-${challenge.category}`}>
                                {challenge.icon}
                            </div>
                            <div className="mission-points">
                                <FaBolt /> {challenge.points} XP
                            </div>
                        </div>

                        <div className="mission-body">
                            <h3>{challenge.title}</h3>
                            <p>{challenge.description}</p>

                            <div className="mission-impact">
                                <FaLeaf /> {challenge.impact}
                            </div>
                        </div>

                        <div className="mission-footer">
                            <div className="mission-meta">
                                <span className={`difficulty-dot ${challenge.difficulty === 'Fácil' ? 'easy' : 'hard'}`}></span>
                                {challenge.difficulty}
                            </div>
                            <button
                                className="btn-mission"
                                onClick={() => handleAcceptMission(challenge.id, challenge.points)}
                                disabled={acceptedMissions[challenge.id]}
                            >
                                {acceptedMissions[challenge.id] ? 'Completado' : 'Iniciar Misión'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
