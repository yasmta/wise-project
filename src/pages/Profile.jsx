import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaUserCircle, FaUserPlus, FaEnvelope, FaTrophy, FaStar,
    FaCheckCircle, FaPaperPlane, FaTimes, FaMedal, FaGlobeAmericas, FaFire, FaShieldAlt
} from 'react-icons/fa';
import './Profile.css';
import Toast from '../components/Toast';

export default function Profile() {
    const { username } = useParams();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState('none');
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isMsgModalOpen, setMsgModalOpen] = useState(false);
    const [msgContent, setMsgContent] = useState('');

    // Toast State
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    useEffect(() => {
        fetchProfile();
    }, [username]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}`, 'x-user-id': user?.id } : {};
            const res = await fetch(`http://localhost:3001/api/social/profile/${username}`, { headers });
            const data = await res.json();

            if (res.ok) {
                setProfile(data);
                setStatus(data.friendshipStatus || 'none');
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const showToast = (msg, type = 'success') => {
        setToast({ show: true, message: msg, type });
    };

    const sendFriendRequest = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3001/api/social/friends/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ toUserId: profile.id })
            });
            if (res.ok) {
                setStatus('pending');
                showToast('Solicitud enviada!', 'success');
            }
        } catch (err) { console.error(err); showToast('Error al enviar solicitud', 'error'); }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!msgContent.trim()) return;
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:3001/api/social/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ toUserId: profile.id, content: msgContent })
            });
            showToast('Mensaje enviado!', 'success');
            setMsgModalOpen(false);
            setMsgContent('');
        } catch (err) { showToast('Error enviando mensaje', 'error'); }
    };

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Cargando perfil...</div>;
    if (!profile) return <div style={{ padding: '5rem', textAlign: 'center' }}>Usuario no encontrado</div>;

    const isMe = user?.username === profile.username;

    // Mock Achievements
    const achievements = [
        { id: 1, name: 'Primeros Pasos', icon: <FaStar style={{ color: '#fbbf24' }} />, unlocked: true },
        { id: 2, name: 'Influencer', icon: <FaGlobeAmericas style={{ color: '#3b82f6' }} />, unlocked: profile.points > 1000 },
        { id: 3, name: 'Leyenda', icon: <FaTrophy style={{ color: '#f59e0b' }} />, unlocked: profile.points > 5000 },
        { id: 4, name: 'Protector', icon: <FaShieldAlt style={{ color: '#10b981' }} />, unlocked: false },
    ];

    return (
        <div className="apps-container fade-in" style={{ paddingTop: '2rem' }}>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            <div className="profile-grid">

                {/* 1. HERO CARD (Left) */}
                <aside className="profile-hero-card">
                    <div className="hero-cover">
                        <div className="hero-avatar-container">
                            <div className="hero-avatar">
                                {profile.username[0]}
                            </div>
                        </div>
                    </div>

                    <div className="hero-info">
                        <h1>{profile.username}</h1>
                        <div className="hero-handle">@{profile.username}</div>

                        <div className="level-badge">
                            <FaMedal /> Nivel {profile.level}
                        </div>

                        {!isMe && (
                            <div className="hero-actions">
                                {status === 'none' && (
                                    <button className="btn-action btn-primary" onClick={sendFriendRequest}>
                                        <FaUserPlus /> Añadir Amigo
                                    </button>
                                )}
                                {status === 'pending' && (
                                    <button className="btn-action btn-secondary" disabled>
                                        Solicitud Pendiente
                                    </button>
                                )}
                                {status === 'accepted' && (
                                    <button className="btn-action btn-secondary" style={{ color: '#10b981', borderColor: '#10b981' }} disabled>
                                        <FaCheckCircle /> Amigos
                                    </button>
                                )}
                                <button className="btn-action btn-secondary" onClick={() => setMsgModalOpen(true)}>
                                    <FaEnvelope /> Enviar Mensaje
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                {/* 2. STATS DASHBOARD (Right Top) */}
                <section className="stats-dashboard">
                    <div className="stat-box">
                        <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                            <FaStar />
                        </div>
                        <span className="stat-val">{profile.points}</span>
                        <span className="stat-label">XP Total</span>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                            <FaTrophy />
                        </div>
                        <span className="stat-val">#{profile.id < 10 ? `0${profile.id}` : profile.id}</span>
                        <span className="stat-label">Ranking Global</span>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                            <FaFire />
                        </div>
                        <span className="stat-val">12</span>
                        <span className="stat-label">Racha Días</span>
                    </div>
                </section>

                {/* 3. ACHIEVEMENTS SHOWCASE (Right Bottom) */}
                <section className="content-showcase">
                    <div className="section-title">
                        <FaTrophy style={{ color: '#f59e0b' }} /> Insignias y Logros
                    </div>

                    <div className="achievements-grid">
                        {achievements.map(ach => (
                            <div key={ach.id} className={`achievement-item ${ach.unlocked ? 'unlocked' : ''}`}>
                                <div className="ach-icon">
                                    {ach.icon}
                                </div>
                                <div className="ach-name">{ach.name}</div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>

            {/* MESSAGE MODAL (Reused Logic) */}
            {isMsgModalOpen && (
                <div className="modal-overlay" onClick={() => setMsgModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, color: '#111' }}>Mensaje para {profile.username}</h3>
                            <button onClick={() => setMsgModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}><FaTimes /></button>
                        </div>
                        <form onSubmit={sendMessage}>
                            <textarea
                                autoFocus
                                value={msgContent}
                                onChange={e => setMsgContent(e.target.value)}
                                style={{
                                    width: '100%', height: '140px', padding: '1rem',
                                    borderRadius: '16px', border: '1px solid #e5e7eb',
                                    backgroundColor: '#f9fafb', marginBottom: '1.5rem',
                                    resize: 'none', fontFamily: 'inherit', fontSize: '1rem'
                                }}
                                placeholder={`Hola ${profile.username}, me gustaría contarte que...`}
                            />
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn-action btn-secondary" style={{ width: 'auto' }} onClick={() => setMsgModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn-action btn-primary" style={{ width: 'auto' }}>
                                    Enviar <FaPaperPlane style={{ marginLeft: 8 }} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
