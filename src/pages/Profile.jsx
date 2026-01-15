import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API_URL from '../api';
import { useAuth } from '../context/AuthContext';
import {
    FaUserCircle, FaUserPlus, FaEnvelope, FaTrophy, FaStar,
    FaCheckCircle, FaPaperPlane, FaTimes, FaMedal, FaGlobeAmericas, FaFire, FaShieldAlt,
    FaKey, FaIdCard
} from 'react-icons/fa';
import './Profile.css';
import Toast from '../components/Toast';
import BadgeList from '../components/BadgeList';

export default function Profile() {
    const { username } = useParams();
    const { t } = useLanguage();
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState('none');
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('badges'); // 'badges', 'password', 'personal'

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
            const res = await fetch(`${API_URL}/api/social/profile/${username}`, { headers });
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
            const res = await fetch(`${API_URL}/api/social/friends/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ toUserId: profile.id })
            });
            if (res.ok) {
                setStatus('pending');
                showToast(t('prof_msg_sent'), 'success');
            }
        } catch (err) { console.error(err); showToast(t('prof_toast_req_error'), 'error'); }
    };

    const acceptFriendRequest = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/social/friends/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ fromUserId: profile.id })
            });
            if (res.ok) {
                setStatus('accepted');
                showToast(t('prof_msg_success_friend'), 'success');
            }
        } catch (err) { console.error(err); showToast(t('prof_toast_friend_error'), 'error'); }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!msgContent.trim()) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/api/social/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ toUserId: profile.id, content: msgContent })
            });
            showToast(t('prof_msg_msg_sent'), 'success');
            setMsgModalOpen(false);
            setMsgContent('');
        } catch (err) { showToast(t('prof_toast_msg_error'), 'error'); }
    };

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>{t('prof_loading')}</div>;
    if (!profile) return <div style={{ padding: '5rem', textAlign: 'center' }}>{t('prof_not_found')}</div>;

    const isMe = user?.username === profile.username;

    // Mock Achievements
    const achievements = [
        { id: 1, name: 'Primeros Pasos', icon: <FaStar style={{ color: '#fbbf24' }} />, unlocked: true },
        { id: 2, name: 'Influencer', icon: <FaGlobeAmericas style={{ color: '#3b82f6' }} />, unlocked: profile.points > 1000 },
        { id: 3, name: 'Leyenda', icon: <FaTrophy style={{ color: '#f59e0b' }} />, unlocked: profile.points > 5000 },
        { id: 4, name: 'Protector', icon: <FaShieldAlt style={{ color: '#10b981' }} />, unlocked: false },
    ];

    return (
        <>
            <div className="apps-container fade-in-up" style={{ paddingTop: '2rem' }}>

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
                                <FaMedal /> {t('prof_level')} {profile.level}
                            </div>

                            {/* ACTIONS / NAVIGATION */}
                            <div className="hero-actions">
                                {isMe ? (
                                    <div className="profile-nav-menu">
                                        <button
                                            className={`nav-btn ${activeTab === 'badges' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('badges')}
                                        >
                                            <FaTrophy /> {t('prof_tab_badges')}
                                        </button>
                                        {user?.username === 'xaviserra' && (
                                            <button
                                                className="nav-btn"
                                                onClick={() => window.location.href = '/admin'}
                                                style={{ color: '#fbbf24', borderColor: '#fbbf24' }}
                                            >
                                                <FaShieldAlt /> {t('prof_tab_admin')}
                                            </button>
                                        )}
                                        <button
                                            className={`nav-btn ${activeTab === 'personal' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('personal')}
                                        >
                                            <FaIdCard /> {t('prof_tab_personal')}
                                        </button>
                                        <button
                                            className={`nav-btn ${activeTab === 'password' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('password')}
                                        >
                                            <FaKey /> {t('prof_tab_password')}
                                        </button>
                                        <button className="nav-btn logout" onClick={logout}>
                                            <FaUserCircle /> {t('prof_btn_logout')}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {status === 'none' && (
                                            <button className="btn-action btn-primary" onClick={sendFriendRequest}>
                                                <FaUserPlus /> {t('prof_btn_add_friend')}
                                            </button>
                                        )}
                                        {status === 'pending' && (
                                            <>
                                                {/* If I am the sender (user.id == profile.friendshipSenderId), show pending */}
                                                {user?.id === profile.friendshipSenderId ? (
                                                    <button className="btn-action btn-secondary" disabled>
                                                        {t('prof_btn_pending')}
                                                    </button>
                                                ) : (
                                                    <button className="btn-action btn-primary" onClick={acceptFriendRequest} style={{ background: '#10b981', borderColor: '#10b981', color: 'white' }}>
                                                        <FaCheckCircle /> {t('prof_btn_accept')}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {status === 'accepted' && (
                                            <button className="btn-action btn-secondary" style={{ color: '#10b981', borderColor: '#10b981' }} disabled>
                                                <FaCheckCircle /> {t('prof_btn_friends')}
                                            </button>
                                        )}
                                        <button className="btn-action btn-secondary" onClick={() => setMsgModalOpen(true)}>
                                            <FaEnvelope /> {t('prof_btn_send_msg')}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* 2. STATS DASHBOARD (Right Top) */}
                    <section className="stats-dashboard">
                        <div className="stat-box">
                            <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                                <FaStar />
                            </div>
                            <span className="stat-val">{profile.points}</span>
                            <span className="stat-label">{t('prof_stat_xp')}</span>
                        </div>

                        <div className="stat-box">
                            <div className="stat-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                                <FaTrophy />
                            </div>
                            <span className="stat-val">#{profile.rank}</span>
                            <span className="stat-label">{t('prof_stat_rank')}</span>
                        </div>

                        <div className="stat-box">
                            <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                                <FaFire />
                            </div>
                            <span className="stat-val">12</span>
                            <span className="stat-label">{t('prof_stat_streak')}</span>
                        </div>
                    </section>

                    {/* 3. MAIN CONTENT (Right Bottom) */}
                    <div className="profile-main-content">

                        {activeTab === 'badges' && (
                            <section className="content-showcase fade-in-up">
                                <div className="section-title">
                                    <FaTrophy style={{ color: '#f59e0b' }} /> {t('prof_sec_badges')}
                                </div>
                                <BadgeList targetUserId={profile.id} />
                            </section>
                        )}

                        {activeTab === 'personal' && (
                            <section className="content-showcase fade-in-up">
                                <div className="section-title">
                                    <FaIdCard style={{ color: '#3b82f6' }} /> {t('prof_sec_personal')}
                                </div>
                                <form className="settings-form" onSubmit={(e) => { e.preventDefault(); showToast(t('prof_toast_updated'), 'success'); }}>
                                    <div className="form-group">
                                        <label>{t('prof_label_username')}</label>
                                        <input type="text" value={profile.username} disabled style={{ opacity: 0.7 }} />
                                        <small>{t('prof_note_username')}</small>
                                    </div>
                                    <div className="form-group">
                                        <label>{t('prof_label_email')}</label>
                                        <input type="email" defaultValue={`${profile.username.toLowerCase()}@wise.com`} />
                                    </div>
                                    <button type="submit" className="btn-action btn-primary" style={{ marginTop: '1rem' }}>{t('prof_btn_save')}</button>
                                </form>
                            </section>
                        )}

                        {activeTab === 'password' && (
                            <section className="content-showcase fade-in-up">
                                <div className="section-title">
                                    <FaKey style={{ color: '#8b5cf6' }} /> {t('prof_sec_password')}
                                </div>
                                <form className="settings-form" onSubmit={(e) => { e.preventDefault(); showToast(t('prof_toast_pwd_updated'), 'success'); }}>
                                    <div className="form-group">
                                        <label>{t('prof_label_current_pwd')}</label>
                                        <input type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('prof_label_new_pwd')}</label>
                                        <input type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('prof_label_confirm_pwd')}</label>
                                        <input type="password" placeholder="••••••••" />
                                    </div>
                                    <button type="submit" className="btn-action btn-primary" style={{ marginTop: '1rem' }}>{t('prof_btn_update_pwd')}</button>
                                </form>
                            </section>
                        )}

                    </div>

                </div>



            </div>

            {/* MESSAGE MODAL (Reused Logic) - Moved Outside Container to fix Fixed Positioning */}
            {
                isMsgModalOpen && (
                    <div className="modal-overlay" onClick={() => setMsgModalOpen(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0, color: '#111' }}>{t('prof_modal_title')} {profile.username}</h3>
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
                )
            }
        </>
    )
}

