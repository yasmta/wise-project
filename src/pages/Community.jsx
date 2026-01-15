import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API_URL from '../api';
import {
    FaUserFriends, FaCommentDots, FaGlobeAmericas,
    FaHeart, FaRegHeart, FaRegComment, FaPaperPlane, FaFire, FaTrophy
} from 'react-icons/fa';
import './Community.css';

// === SUB-COMPONENTS ===

const PostCard = ({ post, user }) => {
    const [likes, setLikes] = useState(post.likes || 0);
    // Initialize isLiked from the backend's user_liked field
    const [isLiked, setIsLiked] = useState(post.user_liked || false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        if (showComments && comments.length === 0) {
            setLoadingComments(true);
            const token = localStorage.getItem('token');
            fetch(`${API_URL}/api/community/posts?parentId=${post.id}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            })
                .then(res => res.json())
                .then(data => {
                    setComments(data);
                    setLoadingComments(false);
                });
        }
    }, [showComments, post.id]);

    const handleLike = async () => {
        // Optimistic update
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikes(prev => newLikedState ? prev + 1 : prev - 1);

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await fetch(`${API_URL}/api/community/posts/${post.id}/like`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) {
            console.error(e);
            // Revert if error
            setIsLiked(!newLikedState);
            setLikes(prev => !newLikedState ? prev + 1 : prev - 1);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/community/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ content: commentContent, parentId: post.id })
        });
        const newCo = await res.json();
        setComments([newCo, ...comments]);
        setCommentContent('');

        // Award points for comment
        try {
            await fetch(`${API_URL}/api/badges/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action_type: 'forum_contributions' })
            });
        } catch (e) { console.error(e); }
    };

    // Parse Content for Special Posts
    let specialData = null;
    let displayContent = post.content;
    try {
        if (post.content.startsWith('{')) {
            const parsed = JSON.parse(post.content);
            if (parsed.type === 'challenge_repost') {
                specialData = parsed;
                displayContent = parsed.message;
            }
        }
    } catch (e) {
        // Not JSON, normal text
    }

    return (
        <div className={`feed-card fade-in ${specialData ? 'special-challenge-card' : ''}`}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: post.avatarColor || '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(168,85,247,0.3)' }}>
                    {post.author[0]}
                </div>
                <div>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>
                        <Link to={`/profile/${post.author}`} style={{ textDecoration: 'none', color: 'inherit' }}>{post.author}</Link>
                    </div>
                    <div className="post-meta">{new Date(post.created_at).toLocaleString()}</div>
                </div>
            </div>

            <div className="post-content">
                {displayContent && <p style={{ marginBottom: '1rem', color: '#334155' }}>{displayContent}</p>}

                {specialData && (
                    <div className="challenge-repost-container">
                        <div className="repost-header">
                            <FaTrophy className="trophy-icon" />
                            <span>¡Desafío Completado!</span>
                        </div>
                        <div className="repost-body">
                            <div className={`repost-icon cat-${specialData.challengeCategory}`}>
                                {/* Simple icon placeholder or we could map category again */}
                                <FaFire />
                            </div>
                            <div className="repost-details">
                                <h4>{specialData.challengeTitle}</h4>
                                {specialData.challengeDescription && (
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 0.5rem 0' }}>
                                        {specialData.challengeDescription}
                                    </p>
                                )}
                                <div className="repost-meta">
                                    <span className="repost-pts">+{specialData.points} XP</span>
                                    {specialData.record && <span className="repost-record">Puntuación: {specialData.record}</span>}
                                </div>
                            </div>
                        </div>
                        {specialData.image && (
                            <div className="repost-media">
                                <img src={specialData.image} alt="Proof" />
                            </div>
                        )}
                        {specialData.link && (
                            <div className="repost-link">
                                <a href={specialData.link} target="_blank" rel="noopener noreferrer">🌐 Ver Evidencia del Enlace</a>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="post-actions">
                <button className={`action-btn ${isLiked ? 'active' : ''}`} onClick={handleLike}>
                    {isLiked ? <FaHeart /> : <FaRegHeart />} {likes}
                </button>
                <button className="action-btn" onClick={() => setShowComments(!showComments)}>
                    <FaRegComment /> {comments.length || post.replies || 0}
                </button>
            </div>

            {showComments && (
                <div className="comments-section" style={{ marginTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                    <form className="comment-input-row" onSubmit={handleComment} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            className="comment-input"
                            style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.1)', background: '#f8fafc' }}
                            placeholder="Add a comment..."
                            value={commentContent}
                            onChange={e => setCommentContent(e.target.value)}
                        />
                        <button type="submit" disabled={!commentContent} style={{ border: 'none', background: 'transparent', color: '#a855f7', cursor: 'pointer' }}>Post</button>
                    </form>

                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loadingComments ? <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>Loading...</div> : comments.map(c => (
                            <div key={c.id} className="comment-item" style={{ display: 'flex', gap: '10px', fontSize: '0.9rem' }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: c.avatarColor || '#64748b', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem' }}>
                                    {c.author[0]}
                                </div>
                                <div style={{ background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '15px' }}>
                                    <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{c.author}</div>
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
        const token = localStorage.getItem('token');
        fetch(`${API_URL}/api/community/posts`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
            .then(res => res.json())
            .then(data => setPosts(Array.isArray(data) ? data : []));
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/api/community/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ content })
        });
        setContent('');
        fetchAll();

        // Award points for post
        try {
            await fetch(`${API_URL}/api/badges/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action_type: 'forum_contributions' })
            });
        } catch (e) { console.error(e); }
    };

    const rootPosts = posts.filter(p => !p.parent_id);

    return (
        <div className="view-container">
            <div className="feed-card">
                <form onSubmit={handlePost}>
                    <div className="composer-area">
                        <textarea
                            placeholder={`What's on your mind, ${user?.username || 'earthling'}?`}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button className="btn-main" style={{ borderRadius: '20px', padding: '0.6rem 1.5rem' }}>
                            <FaPaperPlane style={{ marginRight: '6px' }} /> Publicar
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
    const messagesContainerRef = useRef(null);

    const fetchConvos = () => {
        const token = localStorage.getItem('token');
        fetch(`${API_URL}/api/social/conversations`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
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
        fetchConvos();
        const interval = setInterval(fetchConvos, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeChat) {
            const token = localStorage.getItem('token');
            fetch(`${API_URL}/api/social/messages/${activeChat.id}`, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => res.json())
                .then(setMessages);
        }
    }, [activeChat]);

    // Scrolls only the container, preventing full page jump
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const send = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/social/messages`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ toUserId: activeChat.id, content: input })
        });
        const msg = await res.json();
        setMessages([...messages, { ...msg, sender_id: user.id }]);
        setInput('');
        fetchConvos();
    };

    return (
        <div className="chat-container-glass fade-in-up">
            <div className="chat-sidebar">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 'bold', color: '#334155' }}>Recent Chats</div>
                {loading && <div style={{ padding: '1rem', color: '#64748b' }}>Loading...</div>}
                {!loading && conversations.length === 0 && (
                    <div style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>No chats yet.</div>
                )}
                {conversations.map(c => (
                    <div key={c.id} className={`chat-item-glass ${activeChat?.id === c.id ? 'active' : ''}`} onClick={() => setActiveChat(c)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#a855f7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {c.username[0]}
                            </div>
                            <span>{c.username}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-main">
                {!activeChat ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        Select a conversation to start chatting
                    </div>
                ) : (
                    <>
                        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.2)', fontWeight: '600', color: '#1e293b', background: 'rgba(255,255,255,0.4)' }}>
                            {activeChat.username}
                        </div>
                        <div
                            ref={messagesContainerRef}
                            style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', scrollBehavior: 'smooth' }}
                        >
                            {messages.map((m, i) => (
                                <div key={i} className={`chat-bubble-glass ${m.sender_id === user.id ? 'bubble-me' : 'bubble-them'}`}>
                                    {m.content}
                                </div>
                            ))}
                        </div>
                        <form style={{ padding: '1rem', display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.4)' }} onSubmit={send}>
                            <input style={{ flex: 1, background: 'rgba(255,255,255,0.8)', border: '1px solid transparent', borderRadius: '20px', padding: '0.8rem 1rem', color: '#1e293b' }}
                                placeholder="Type a message..."
                                value={input} onChange={e => setInput(e.target.value)} />
                            <button className="btn-main" style={{ borderRadius: '50%', width: 45, height: 45, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FaPaperPlane />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

// === WIDGETS SIDEBAR ===
const RightSidebar = () => {
    return (
        <aside className="social-widgets fade-in-up delay-200">
            <div className="widget-card">
                <div className="widget-title"><FaFire style={{ color: '#f97316' }} /> Trending</div>
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
                <div className="widget-title"><FaUserFriends style={{ color: '#a855f7' }} /> Recommended</div>
                <div style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.8rem' }}>Connect with eco-warriors:</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#10b981' }}></div>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>EcoBot_99</span>
                    </div>
                    <button style={{ background: '#e0e7ff', border: 'none', color: '#4f46e5', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer' }}>+</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f43f5e' }}></div>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>GreenLife</span>
                    </div>
                    <button style={{ background: '#e0e7ff', border: 'none', color: '#4f46e5', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer' }}>+</button>
                </div>
            </div>
        </aside>
    );
};

// === CORE SHELL V5 ===

export default function Community() {
    const [view, setView] = useState('feed');
    const { user } = useAuth(); // Ensures user is context-aware

    return (
        <div className="community-page">
            <div className="ambient-glow" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}></div>

            <div className="container" style={{ paddingTop: '2rem' }}>
                <div className="glass-tabs-container fade-in-up">
                    <div className="glass-tabs">
                        {/* THE SLIDING ANIMATED BACKGROUND */}
                        <div className={`tab-glider ${view}`}></div>

                        <button
                            className={`tab-pill ${view === 'feed' ? 'active' : ''}`}
                            onClick={() => setView('feed')}
                        >
                            <FaGlobeAmericas /> Community Feed
                        </button>
                        <button
                            className={`tab-pill ${view === 'chat' ? 'active' : ''}`}
                            onClick={() => setView('chat')}
                        >
                            <FaCommentDots /> Messages
                        </button>
                    </div>
                </div>

                <div className={`community-layout ${view === 'chat' ? 'chat-mode' : ''}`}>
                    {/* LEFT MAIN CONTENT */}
                    <main className="social-main">
                        {view === 'feed' && <FeedView user={user} />}
                        {view === 'chat' && <ChatView user={user} />}
                    </main>

                    {/* RIGHT WIDGETS (Only visible on Feed view for cleaner chat experience) */}
                    {view === 'feed' ? <RightSidebar /> : null}
                </div>
            </div>
        </div>
    );
}
