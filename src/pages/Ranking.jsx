import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import API_URL from '../api';
import { useAuth } from '../context/AuthContext';
import { FaCrown, FaArrowUp, FaArrowDown, FaMinus, FaUserAstronaut } from 'react-icons/fa';
import './Ranking.css';

export default function Ranking() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/user/leaderboard`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error('Invalid leaderboard data:', data);
                    setUsers([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch leaderboard:', err);
                setUsers([]);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="container fade-in" style={{ padding: '4rem', textAlign: 'center' }}>Cargando ranking...</div>;
    }

    // Safety checks
    const safeUsers = Array.isArray(users) ? users : [];
    const top3 = safeUsers.slice(0, 3);
    const rest = safeUsers.slice(3);

    const getTrendIcon = (trend) => {
        if (trend === 'up') return <FaArrowUp className="trend-icon up" />;
        if (trend === 'down') return <FaArrowDown className="trend-icon down" />;
        return <FaMinus className="trend-icon stable" />;
    };

    // Calculate User Rank Logic
    let myRank = '-';
    let currentPoints = 0;

    try {
        const currentUserRankIndex = safeUsers.findIndex(u => u.name === user?.username);
        if (currentUserRankIndex !== -1) {
            myRank = safeUsers[currentUserRankIndex].rank;
            currentPoints = safeUsers[currentUserRankIndex].points;
        } else if (user?.points) {
            currentPoints = user.points;
        }
    } catch (e) {
        console.warn('Rank calculation error:', e);
    }

    // Level Calculation
    const currentLevel = Math.floor(currentPoints / 500) + 1;
    const nextLevelPoints = currentLevel * 500;
    const pointsToNext = nextLevelPoints - currentPoints;

    return (
        <div className="container fade-in" style={{ padding: '2rem 1rem', paddingBottom: '6rem' }}>

            <header className="page-header">
                <h1>{t('rank_title')}</h1>
                <p>Compite con la élite de los protectores del planeta.</p>
            </header>

            {/* MAIN LEAGUE CARD - Unified Structure */}
            <div className="league-card fade-in-up">

                {/* 1. Header & Controls */}
                <div className="league-header">
                    <div className="league-info">
                        <span className="league-badge">Liga Diamante</span>
                        <h3>Temporada 1</h3>
                    </div>
                </div>

                {/* EMPTY STATE */}
                {safeUsers.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <h3>No hay participantes aún</h3>
                        <p>¡Sé el primero en completar un reto!</p>
                    </div>
                )}

                {/* 2. PODIUM SECTION (Integrated) */}
                <div className="podium-section">
                    {/* 2nd */}
                    {top3[1] && (
                        <div className="podium-item item-2">
                            <div className="p-avatar">
                                <div className="pa-circle" style={{ background: top3[1].avatarColor }}>
                                    <FaUserAstronaut />
                                </div>
                                <span className="p-rank r-2">2</span>
                            </div>
                            <div className="p-base">
                                <span className="p-name">{top3[1].name}</span>
                                <span className="p-score">{top3[1].points} XP</span>
                            </div>
                        </div>
                    )}

                    {/* 1st */}
                    {top3[0] && (
                        <div className="podium-item item-1">
                            <FaCrown className="crown-anim" />
                            <div className="p-avatar winner">
                                <div className="pa-circle" style={{ background: top3[0].avatarColor }}>
                                    <FaUserAstronaut />
                                </div>
                                <span className="p-rank r-1">1</span>
                            </div>
                            <div className="p-base base-winner">
                                <span className="p-name">{top3[0].name}</span>
                                <span className="p-score">{top3[0].points} XP</span>
                            </div>
                        </div>
                    )}

                    {/* 3rd */}
                    {top3[2] && (
                        <div className="podium-item item-3">
                            <div className="p-avatar">
                                <div className="pa-circle" style={{ background: top3[2].avatarColor }}>
                                    <FaUserAstronaut />
                                </div>
                                <span className="p-rank r-3">3</span>
                            </div>
                            <div className="p-base">
                                <span className="p-name">{top3[2].name}</span>
                                <span className="p-score">{top3[2].points} XP</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. TABLE SECTION (Connected) */}
                <div className="leaderboard-section">
                    <table className="clean-table">
                        <thead>
                            <tr>
                                <th width="10%">#</th>
                                <th>Usuario</th>
                                <th className="text-right">XP Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rest.map((rUser) => (
                                <tr key={rUser.rank}>
                                    <td>
                                        <span className="rank-num">#{rUser.rank}</span>
                                    </td>
                                    <td>
                                        <div className="user-flex">
                                            <div className="u-dot" style={{ background: rUser.avatarColor }}></div>
                                            <span className="u-txt">{rUser.name}</span>
                                            {getTrendIcon(rUser.trend)}
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <span className="xp-txt">{rUser.points}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* STICKY USER BAR */}
            <div className="sticky-user-rank">
                <div className="my-rank-info">
                    <div className="u-rank">#{myRank}</div>
                    <div className="u-details">
                        <span className="u-name-self">{user?.username || 'Invitado'}</span>
                        <span className="u-pts">{currentPoints} XP (Nvl {currentLevel})</span>
                    </div>
                </div>
                {user && (
                    <div className="next-rank-tip">
                        <FaArrowUp /> A {pointsToNext} XP del Nivel {currentLevel + 1}
                    </div>
                )}
            </div>

        </div>
    );
}
