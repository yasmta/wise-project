import { useState, useEffect } from 'react';
import API_URL from '../api';
import { useAuth } from '../context/AuthContext';
import { FaLock } from 'react-icons/fa';

export default function BadgeList({ targetUserId }) { // targetUserId allows viewing others' badges in future
    const { user } = useAuth();
    const [badges, setBadges] = useState([]);
    const [userBadges, setUserBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        fetchData();
    }, [targetUserId]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const [badgesRes, userBadgesRes] = await Promise.all([
                fetch(`${API_URL}/api/badges`, { headers }),
                // If viewing another profile, we might need a different endpoint, 
                // but for now let's assume we want to show badges of the profile we are viewing.
                // However, the current backend implementation for 'my-badges' only returns *my* badges.
                // For this iteration, let's just fetch *current user's* badges if viewing self, 
                // or if we add a public endpoint later. 
                // Assuming `targetUserId` is meaningful (it's not fully wired in backend yet for public view).
                // Let's stick to showing *current user's* badges or make a "my-badges" call.
                fetch(`${API_URL}/api/badges/my-badges`, { headers })
            ]);

            const badgesData = await badgesRes.json();
            const userBadgesData = await userBadgesRes.json();

            if (badgesRes.ok) setBadges(badgesData);
            if (userBadgesRes.ok) setUserBadges(userBadgesData);
        } catch (error) {
            console.error('Error fetching badges:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Cargando insignias...</div>;

    // Grouping logic
    const categories = [
        { id: 'all', label: 'Todas' },
        { id: 'learning', label: 'Aprendizaje' },
        { id: 'home', label: 'Hogar' },
        { id: 'habits', label: 'Hábitos' },
        { id: 'community', label: 'Comunidad' },
        { id: 'action', label: 'Acción' },
        { id: 'company', label: 'Empresas' },
        { id: 'special', label: 'Especiales' },
    ];

    const filteredBadges = activeCategory === 'all'
        ? badges
        : badges.filter(b => b.category === activeCategory);

    // Helpers
    const isEarned = (badgeId) => userBadges.some(ub => ub.id === badgeId || ub.badge_id === badgeId);

    return (
        <div className="badge-list-container">
            {/* Category Filter */}
            <div className="badge-categories" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`btn-category ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                        style={{
                            padding: '0.4rem 1rem',
                            borderRadius: '20px',
                            border: '1px solid var(--color-primary-light)',
                            background: activeCategory === cat.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
                            color: activeCategory === cat.id ? 'white' : 'var(--color-text-main)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                {filteredBadges.map(badge => {
                    const earned = isEarned(badge.id);
                    return (
                        <div
                            key={badge.id}
                            className={`badge-card ${earned ? 'earned' : 'locked'}`}
                            style={{
                                background: earned ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                                padding: '1rem',
                                borderRadius: '16px',
                                textAlign: 'center',
                                border: earned ? '1px solid var(--color-primary)' : '1px solid transparent',
                                opacity: earned ? 1 : 0.7,
                                filter: earned ? 'none' : 'grayscale(100%)',
                                position: 'relative',
                                transition: 'all 0.3s'
                            }}
                        >
                            {!earned && (
                                <div style={{ position: 'absolute', top: 8, right: 8, color: '#999' }}>
                                    <FaLock size={12} />
                                </div>
                            )}
                            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                                {badge.icon.startsWith('/') ? (
                                    <img
                                        src={badge.icon}
                                        alt={badge.name}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                            border: '3px solid white',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                ) : (
                                    <span style={{ fontSize: '2.5rem' }}>{badge.icon}</span>
                                )}
                            </div>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem', lineHeight: 1.2 }}>{badge.name}</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                                {badge.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
