import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import './Challenges.css';

export default function Challenges() {
    const [filter, setFilter] = useState('all');
    const { t } = useLanguage();
    const { user, isAuthenticated, updatePoints } = useAuth();

    const challenges = [
        {
            id: 1,
            title: t('chal_c1_title'),
            description: t('chal_c1_desc'),
            category: 'transporte',
            difficulty: t('chal_diff_medium'),
            points: 50
        },
        {
            id: 2,
            title: t('chal_c2_title'),
            description: t('chal_c2_desc'),
            category: 'hogar',
            difficulty: t('chal_diff_easy'),
            points: 20
        },
        {
            id: 3,
            title: t('chal_c3_title'),
            description: t('chal_c3_desc'),
            category: 'consumo',
            difficulty: t('chal_diff_hard'),
            points: 100
        },
        {
            id: 4,
            title: t('chal_c4_title'),
            description: t('chal_c4_desc'),
            category: 'hogar',
            difficulty: t('chal_diff_easy'),
            points: 30
        },
    ];

    const filteredChallenges = filter === 'all'
        ? challenges
        : challenges.filter(c => c.category === filter);

    const handleCompleteChallenge = async (points) => {
        if (!isAuthenticated) {
            alert(t('auth_login_required') || 'Please login to earn points');
            return;
        }

        const newTotal = (user.points || 0) + points;
        try {
            await updatePoints(newTotal);
            alert(`Challenge completed! You earned ${points} points.`);
        } catch (error) {
            console.error('Error updating points', error);
        }
    };

    return (
        <div className="container fade-in" style={{ padding: '2rem 1rem' }}>
            <div className="challenges-header">
                <h1>{t('chal_title')}</h1>
                <p>{t('chal_subtitle')}</p>
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    {t('chal_filter_all')}
                </button>
                <button
                    className={`filter-btn ${filter === 'transporte' ? 'active' : ''}`}
                    onClick={() => setFilter('transporte')}
                >
                    {t('chal_filter_transport')}
                </button>
                <button
                    className={`filter-btn ${filter === 'hogar' ? 'active' : ''}`}
                    onClick={() => setFilter('hogar')}
                >
                    {t('chal_filter_home')}
                </button>
                <button
                    className={`filter-btn ${filter === 'consumo' ? 'active' : ''}`}
                    onClick={() => setFilter('consumo')}
                >
                    {t('chal_filter_consumption')}
                </button>
            </div>

            {/* Grid */}
            <div className="grid-3">
                {filteredChallenges.map(challenge => (
                    <div key={challenge.id} className="card challenge-card">
                        <div className="card-header">
                            <span className={`tag tag-${challenge.category}`}>{challenge.category}</span>
                            <span className="points">{challenge.points} pts</span>
                        </div>
                        <h3>{challenge.title}</h3>
                        <p>{challenge.description}</p>
                        <div className="card-footer">
                            <span className="difficulty">
                                {challenge.difficulty}
                            </span>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleCompleteChallenge(challenge.points)}
                            >
                                {t('chal_btn_accept') || 'Complete'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
