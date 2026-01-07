import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    FaHome, FaUserFriends, FaCommentDots, FaUser, FaGlobeAmericas,
    FaHeart, FaRegHeart, FaRegComment, FaPaperPlane, FaSearch, FaHashtag, FaFire
} from 'react-icons/fa';
import './SocialHub.css'; // V4 Styles

// === SUB-COMPONENTS ===

const PostCard = ({ post, user }) => {
    const [likes, setLikes] = useState(post.likes || 0);
    const [isLiked, setIsLiked] = useState(false); // Simplified: Assume false on load for now, distinct endpoint needed for 'check like'
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]); // Fetch if showing
    const [commentContent, setCommentContent] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    // Fetch comments when toggled
    useEffect(() => {
        if (showComments && comments.length === 0) {
            setLoadingComments(true);
            fetch(`http://localhost:3001/api/community/posts?parentId=${post.id}`)
                .then(res => res.json())
                .then(data => {
                    setComments(data);
                    setLoadingComments(false);
                });
        }
    }, [showComments, post.id]);

    const handleLike = async () => {
        // Optimistic
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);

        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:3001/api/community/posts/${post.id}/like`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) { console.error(e); }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3001/api/community/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ content: commentContent, parentId: post.id })
        });
        const newCo = await res.json();
        setComments([newCo, ...comments]); // Prepend logic
        setCommentContent('');

        // Award points for comment
        try {
            await fetch('http://localhost:3001/api/badges/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action_type: 'forum_contributions' })
            });
        } catch (e) { console.error(e); }
    };

    return (
        <div className="feed-card">
            <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: post.avatarColor || '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>
                    {post.author[0]}
                </div>
                <div>
                    <div style={{ fontWeight: '700' }}>
                        <Link to={`/profile/${post.author}`}>{post.author}</Link>
                    </div>
                    <div className="post-meta">{new Date(post.created_at).toLocaleString()}</div>
                </div>
            </div>

            <div className="post-content">
                {post.content}
            </div>

            <div className="post-actions">
                <button className={`action-btn ${isLiked ? 'active' : ''}`} onClick={handleLike}>
                    {isLiked ? <FaHeart /> : <FaRegHeart />} {likes}
                </button>
                <button className="action-btn" onClick={() => setShowComments(!showComments)}>
                    <FaRegComment /> {comments.length || post.replies || 0} Comentarios
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    <form className="comment-input-row" onSubmit={handleComment}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem' }}>
                            {user?.username?.[0]}
                        </div>
                        <input
                            className="comment-input"
                            placeholder="Escribe una respuesta..."
                            value={commentContent}
                            onChange={e => setCommentContent(e.target.value)}
                        />
                    </form>

                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loadingComments ? <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>Cargando...</div> : comments.map(c => (
                            <div key={c.id} className="comment-item">
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: c.avatarColor || '#64748b', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem' }}>
                                    {c.author[0]}
                                </div>
                                <div>
                                    <div className="comment-author">
                                        <Link to={`/profile/${c.author}`}>
                                            {c.author}
                                        </Link>
                                    </div>
                                    <div className="comment-text">{c.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const FeedView = ({ user }) => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');

    const fetchAll = () => {
        fetch('http://localhost:3001/api/community/posts')
            .then(res => res.json())
            .then(data => setPosts(Array.isArray(data) ? data : [])); // Logic to filter out comments (parent_id != null) ideally handled by backend or filter here
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        const token = localStorage.getItem('token');
        await fetch('http://localhost:3001/api/community/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ content })
        });
        setContent('');
        fetchAll();

        // Award points for post
        try {
            await fetch('http://localhost:3001/api/badges/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action_type: 'forum_contributions' })
            });
        } catch (e) { console.error(e); }
    };

    const rootPosts = posts.filter(p => !p.parent_id);

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h2>Inicio</h2>
            </div>

            <div className="feed-card">
                <form onSubmit={handlePost}>
                    <div className="composer-area">
                        <textarea
                            placeholder="¿Qué estás pensando?"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn-main" style={{ borderRadius: '20px', padding: '0.6rem 1.5rem' }}>
                            Publicar
                        </button>
                    </div>
                </form>
            </div>

            <div className="stream">
                {rootPosts.map(post => (
                    <PostCard key={post.id} post={post} user={user} />
                ))}
            </div>
        </div>
    );
};

const ChatView = ({ user }) => {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const chatEndRef = useRef(null);

    const fetchConvos = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:3001/api/social/conversations', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => {
                if (!res.ok) throw new Error("Failed");
                return res.json();
            })
            .then(data => {
                setConversations(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchConvos(); // Initial fetch
        const interval = setInterval(fetchConvos, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeChat) {
            const token = localStorage.getItem('token');
            fetch(`http://localhost:3001/api/social/messages/${activeChat.id}`, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => res.json())
                .then(setMessages);
        }
    }, [activeChat]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3001/api/social/messages', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ toUserId: activeChat.id, content: input })
        });
        const msg = await res.json();
        setMessages([...messages, { ...msg, sender_id: user.id }]);
        setInput('');
        fetchConvos(); // Immediate refresh
    };

    return (
        <div className="view-container fade-in" style={{ height: '100%' }}>
            <div className="view-header">
                <h2>Mensajes</h2>
            </div>
            <div className="chat-layout-glass">
                <div className="chat-list-glass">
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', color: '#334155' }}>Chats</div>
                    {loading && <div style={{ padding: '1rem', color: '#64748b' }}>Cargando...</div>}
                    {!loading && conversations.length === 0 && (
                        <div style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>No chats yet.</div>
                    )}
                    {conversations.map(c => (
                        <div key={c.id} className={`chat-item-glass ${activeChat?.id === c.id ? 'active' : ''}`} onClick={() => setActiveChat(c)}>
                            {c.username}
                        </div>
                    ))}
                </div>
                <div className="chat-window-glass">
                    {!activeChat ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                            Select a chat
                        </div>
                    ) : (
                        <>
                            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#1e293b' }}>
                                {activeChat.username}
                            </div>
                            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {messages.map((m, i) => (
                                    <div key={i} className={`chat-bubble-glass ${m.sender_id === user.id ? 'bubble-me' : 'bubble-them'}`}>
                                        {m.content}
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <form style={{ padding: '1rem', display: 'flex', gap: '10px', borderTop: '1px solid #e2e8f0' }} onSubmit={send}>
                                <input style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '0.8rem 1rem', color: '#1e293b' }}
                                    placeholder="Escribe un mensaje..."
                                    value={input} onChange={e => setInput(e.target.value)} />
                                <button className="btn-main" style={{ borderRadius: '50%', width: 45, height: 45, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaPaperPlane />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// === WIDGETS SIDEBAR ===
const RightSidebar = () => {
    return (
        <aside className="social-widgets">
            <div className="widget-card">
                <div className="widget-title"><FaFire style={{ color: '#f97316' }} /> Tendencias</div>
                <div className="trend-item">
                    <span className="trend-tag">#SaveTheOcean</span>
                    <span className="trend-stat">2.4k posts</span>
                </div>
                <div className="trend-item">
                    <span className="trend-tag">#UrbanFarming</span>
                    <span className="trend-stat">1.8k posts</span>
                </div>
                <div className="trend-item">
                    <span className="trend-tag">#PlasticFree</span>
                    <span className="trend-stat">940 posts</span>
                </div>
            </div>

            <div className="widget-card">
                <div className="widget-title"><FaUserFriends style={{ color: '#a855f7' }} /> Sugerencias</div>
                <div style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.5rem' }}>Personas que quizás te interesen:</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#10b981' }}></div>
                        <span>EcoBot_99</span>
                    </div>
                    <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: 28, height: 28 }}>+</button>
                </div>
            </div>
        </aside>
    );
};

// === CORE SHELL V4 ===

export default function Community() {
    const [view, setView] = useState('feed');
    const { user } = useAuth();

    return (
        <div className="social-shell">
            {/* LEFT NAV */}
            <nav className="social-nav">
                <div>
                    <div className="brand-logo">
                        <FaGlobeAmericas /> Wise Social
                    </div>
                    <div className="nav-menu">
                        <div className={`nav-item ${view === 'feed' ? 'active' : ''}`} onClick={() => setView('feed')}>
                            <FaHome style={{ fontSize: '1.2rem' }} /> Home
                        </div>
                        <div className={`nav-item ${view === 'chat' ? 'active' : ''}`} onClick={() => setView('chat')}>
                            <FaCommentDots style={{ fontSize: '1.2rem' }} /> Mensajes
                        </div>
                        <Link to={`/profile/${user?.username}`} className="nav-item" style={{ textDecoration: 'none' }}>
                            <FaUser style={{ fontSize: '1.2rem' }} /> Mi Perfil
                        </Link>
                    </div>
                </div>

                {user && (
                    <div className="user-mini-profile">
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                            {user.username[0]}
                        </div>
                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>@{user.username}</div>
                    </div>
                )}
            </nav>

            {/* MIDDLE (DYNAMIC) */}
            <main className="social-main">
                {view === 'feed' && <FeedView user={user} />}
                {view === 'chat' && <ChatView user={user} />}
            </main>

            {/* RIGHT WIDGETS */}
            {view === 'feed' && <RightSidebar />}
        </div>
    );
}
