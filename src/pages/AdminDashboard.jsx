import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../api';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form states
    const [newUser, setNewUser] = useState({ username: '', password: '', email: '', country: '' });
    const [pointsUpdate, setPointsUpdate] = useState({}); // { [userId]: points }

    // Challenge Form State
    const [newChallenge, setNewChallenge] = useState({
        title: '',
        description: '',
        category: 'transporte',
        points: 10,
        level: 'easy',
        verification_type: 'auto',
        periodicity: 'once'
    });

    useEffect(() => {
        if (!isAuthenticated) return;
        if (user.username !== 'xaviserra') {
            navigate('/');
            return;
        }
        fetchData();
    }, [isAuthenticated, user, navigate, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            if (activeTab === 'users') {
                const res = await fetch(`${API_URL}/api/admin/users`, { headers });
                if (!res.ok) throw new Error('Failed to fetch users');
                const data = await res.json();
                setUsers(data);
            } else if (activeTab === 'posts') {
                const res = await fetch(`${API_URL}/api/admin/posts`, { headers });
                if (!res.ok) throw new Error('Failed to fetch posts');
                const data = await res.json();
                setPosts(data);
            } else if (activeTab === 'challenges') {
                const res = await fetch(`${API_URL}/api/admin/challenges`, { headers });
                if (!res.ok) throw new Error('Failed to fetch challenges');
                const data = await res.json();
                setChallenges(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newUser)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to create user');
            }

            setNewUser({ username: '', password: '', email: '', country: '' });
            fetchData();
            alert('User created successfully');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete user');
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdatePoints = async (id) => {
        const points = pointsUpdate[id];
        if (points === undefined) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/users/${id}/points`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ points: parseInt(points) })
            });
            if (!res.ok) throw new Error('Failed to update points');
            alert('Points updated');
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeletePost = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/posts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete post');
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCreateChallenge = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/challenges`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...newChallenge,
                    points: parseInt(newChallenge.points) || 0
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to create challenge');
            }

            setNewChallenge({
                title: '',
                description: '',
                category: 'transporte',
                points: 10,
                level: 'easy',
                verification_type: 'auto',
                periodicity: 'once'
            });
            fetchData();
            alert('Challenge created successfully');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteChallenge = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/challenges/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete challenge');
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading && !users.length && !posts.length && !challenges.length) return <div className="admin-container">Loading...</div>;
    // if (error) return <div className="admin-container">Error: {error}</div>; // Suppress error slightly to allow tab switching if one fails? No, simpler is better.

    return (
        <div className="admin-container fade-in-up">
            <h1 className="admin-title">{t('admin_title')}</h1>

            <div className="admin-tabs">
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    {t('admin_tab_users')}
                </button>
                <button
                    className={activeTab === 'posts' ? 'active' : ''}
                    onClick={() => setActiveTab('posts')}
                >
                    {t('admin_tab_posts')}
                </button>
                <button
                    className={activeTab === 'challenges' ? 'active' : ''}
                    onClick={() => setActiveTab('challenges')}
                >
                    {t('admin_tab_challenges')}
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'users' && (
                    <div className="admin-section fade-in">
                        <h2>{t('admin_create_user')}</h2>
                        <form onSubmit={handleCreateUser} className="admin-form">
                            <input
                                placeholder={t('admin_ph_username')}
                                value={newUser.username}
                                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                required
                            />
                            <input
                                placeholder={t('admin_ph_password')}
                                type="password"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                required
                            />
                            <input
                                placeholder={t('admin_ph_email')}
                                type="email"
                                value={newUser.email}
                                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                required
                            />
                            <input
                                placeholder={t('admin_ph_country')}
                                value={newUser.country}
                                onChange={e => setNewUser({ ...newUser, country: e.target.value })}
                                required
                            />
                            <button type="submit" className="btn-primary">{t('admin_btn_create')}</button>
                        </form>

                        <h2>{t('admin_list_users')}</h2>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t('admin_col_id')}</th>
                                        <th>{t('admin_col_user')}</th>
                                        <th>{t('admin_col_email')}</th>
                                        <th>{t('admin_col_points')}</th>
                                        <th>{t('admin_col_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.username}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <div className="points-edit">
                                                    <span>{u.points}</span>
                                                    <input
                                                        type="number"
                                                        placeholder={t('admin_ph_new')}
                                                        value={pointsUpdate[u.id] || ''}
                                                        onChange={(e) => setPointsUpdate({ ...pointsUpdate, [u.id]: e.target.value })}
                                                    />
                                                    <button onClick={() => handleUpdatePoints(u.id)}>{t('admin_btn_save')}</button>
                                                </div>
                                            </td>
                                            <td>
                                                <button className="delete-btn" onClick={() => handleDeleteUser(u.id)}>
                                                    {t('admin_btn_delete')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'posts' && (
                    <div className="admin-section fade-in">
                        <h2>{t('admin_all_posts')}</h2>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t('admin_col_id')}</th>
                                        <th>{t('admin_col_author')}</th>
                                        <th>{t('admin_col_content')}</th>
                                        <th>{t('admin_col_date')}</th>
                                        <th>{t('admin_col_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{p.author}</td>
                                            <td>{p.content.substring(0, 50)}...</td>
                                            <td>{new Date(p.created_at).toLocaleString()}</td>
                                            <td>
                                                <button className="delete-btn" onClick={() => handleDeletePost(p.id)}>
                                                    {t('admin_btn_delete')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'challenges' && (
                    <div className="admin-section fade-in">
                        <h2>{t('admin_create_challenge')}</h2>
                        <form onSubmit={handleCreateChallenge} className="admin-form vertical">
                            <div className="form-row">
                                <input
                                    placeholder={t('admin_ph_title')}
                                    value={newChallenge.title}
                                    onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })}
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder={t('admin_ph_points')}
                                    value={newChallenge.points}
                                    onChange={e => setNewChallenge({ ...newChallenge, points: e.target.value })}
                                    required
                                />
                            </div>
                            <textarea
                                placeholder={t('admin_ph_description')}
                                value={newChallenge.description}
                                onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })}
                            />
                            <div className="form-row">
                                <select
                                    value={newChallenge.category}
                                    onChange={e => setNewChallenge({ ...newChallenge, category: e.target.value })}
                                >
                                    <option value="transporte">Transporte</option>
                                    <option value="hogar">Hogar</option>
                                    <option value="consumo">Consumo</option>
                                    <option value="educacion">Educación</option>
                                    <option value="social">Social</option>
                                    <option value="empresa">Empresa</option>
                                </select>
                                <select
                                    value={newChallenge.level}
                                    onChange={e => setNewChallenge({ ...newChallenge, level: e.target.value })}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                                <select
                                    value={newChallenge.verification_type}
                                    onChange={e => setNewChallenge({ ...newChallenge, verification_type: e.target.value })}
                                >
                                    <option value="auto">Auto</option>
                                    <option value="photo">Photo</option>
                                    <option value="link">Link</option>
                                    <option value="quiz">Quiz</option>
                                </select>
                                <select
                                    value={newChallenge.periodicity}
                                    onChange={e => setNewChallenge({ ...newChallenge, periodicity: e.target.value })}
                                >
                                    <option value="once">Una vez</option>
                                    <option value="weekly">Semanal</option>
                                    <option value="monthly">Mensual</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-primary">{t('admin_btn_add_challenge')}</button>
                        </form>

                        <h2>{t('admin_all_challenges')}</h2>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t('admin_col_id')}</th>
                                        <th>{t('admin_col_title')}</th>
                                        <th>{t('admin_col_category')}</th>
                                        <th>{t('admin_col_points')}</th>
                                        <th>{t('admin_col_type')}</th>
                                        <th>{t('admin_col_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {challenges.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td>{c.title}</td>
                                            <td><span className={`badge ${c.category}`}>{c.category}</span></td>
                                            <td>{c.points}</td>
                                            <td>{c.verification_type}</td>
                                            <td>
                                                <button className="delete-btn" onClick={() => handleDeleteChallenge(c.id)}>
                                                    {t('admin_btn_delete')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
