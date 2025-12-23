import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaComment, FaPaperPlane, FaUserCircle, FaTrash, FaCheckCircle, FaLeaf, FaTint } from 'react-icons/fa';
import './Community.css';

export default function Community() {
    const { t } = useLanguage();
    const { user, isAuthenticated } = useAuth();

    // Mock initial posts
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'EcoWarrior',
            handle: '@eco_warrior',
            avatarColor: '#bfdbfe', // blue-200
            time: '2h',
            content: 'Just discovered that the hole in the ozone layer is shrinking! 🌍 Small actions really do add up. #OzoneRecovery #ProjectWise',
            likes: 45,
            replies: 12,
            isUserPost: false
        },
        {
            id: 2,
            author: 'SarahGreen',
            handle: '@sarah_g',
            avatarColor: '#bbf7d0', // green-200
            time: '4h',
            content: 'Does anyone have tips for reducing plastic use in the kitchen? Trying to be more sustainable! 🌱',
            likes: 12,
            replies: 8,
            isUserPost: false
        },
        {
            id: 3,
            author: 'ProjectWise Official',
            handle: '@wise_team',
            avatarColor: '#c084fc', // purple
            isVerified: true,
            time: '6h',
            content: 'New challenge alert: "Zero Waste Weekend". Are you in? Check the Challenges tab! 🚀',
            likes: 156,
            replies: 42,
            isUserPost: false
        }
    ]);

    const [newPostContent, setNewPostContent] = useState('');

    const handlePostSubmit = (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        const newPost = {
            id: Date.now(),
            author: user?.username || 'Yumi',
            handle: `@${user?.username || 'yumi'}`,
            avatarColor: '#f9a8d4', // pink-300
            content: newPostContent,
            likes: 0,
            replies: 0,
            time: 'Now',
            isUserPost: true
        };

        setPosts([newPost, ...posts]);
        setNewPostContent('');
    };

    const handleLike = (id) => {
        setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    };

    const handleDelete = (id) => {
        if (window.confirm(t('comm_confirm_delete') || 'Delete this post?')) {
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    if (!isAuthenticated) return (
        <div className="container center-message" style={{ padding: '5rem', textAlign: 'center' }}>
            <h2>Log in to join the community</h2>
        </div>
    );

    return (
        <div className="apps-container fade-in">
            <div className="community-layout">

                {/* Left Sidebar */}
                <aside className="sidebar-left">
                    {/* User Profile Card */}
                    <div className="dashboard-card profile-card">
                        <div className="profile-header-gradient"></div>
                        <div className="profile-info">
                            <div className="profile-avatar">
                                <FaUserCircle />
                            </div>
                            <h3>{user?.username || 'Yumi'}</h3>
                            <span className="profile-subtitle">Eco-Warrior Level 5</span>

                            <div className="profile-stats-row">
                                <div className="p-stat">
                                    <span className="p-label">Points</span>
                                    <span className="p-val highlight">200</span>
                                </div>
                                <div className="p-stat">
                                    <span className="p-label">Impact</span>
                                    <span className="p-val success">High</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trending Topics */}
                    <div className="dashboard-card trending-card">
                        <h4>📈 Trending Topics</h4>
                        <div className="trend-row">
                            <span className="trend-tag">#ProjectWise</span>
                            <span className="trend-count">2.4k</span>
                        </div>
                        <div className="trend-row">
                            <span className="trend-tag">#ZeroWaste</span>
                            <span className="trend-count">1.8k</span>
                        </div>
                        <div className="trend-row">
                            <span className="trend-tag">#SustainableLiving</span>
                            <span className="trend-count">950</span>
                        </div>
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="feed-center">
                    {/* Home Header */}
                    <div className="page-header">
                        <h2>Home</h2>
                    </div>

                    {/* Compose Box */}
                    <div className="dashboard-card compose-card">
                        <div className="compose-row">
                            <div className="c-avatar" style={{ background: '#f9a8d4' }}>
                                <FaUserCircle />
                            </div>
                            <form onSubmit={handlePostSubmit} className="c-form">
                                <textarea
                                    placeholder="What's happening in the eco-world?"
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                />
                                <div className="c-actions">
                                    <div className="c-icons"></div>
                                    <button type="submit" className="btn-send-icon">
                                        <FaPaperPlane />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Posts Feed */}
                    <div className="posts-stream">
                        {posts.map(post => (
                            <div key={post.id} className="dashboard-card post-item">
                                <div className="post-header">
                                    <div className="post-user-info">
                                        <div className="post-avatar" style={{ background: post.avatarColor || '#ddd' }}>
                                            {post.author[0]}
                                        </div>
                                        <div className="post-user-text">
                                            <span className="p-name">
                                                {post.author}
                                                {post.isVerified && <FaCheckCircle className="verified-badge" />}
                                            </span>
                                            <span className="p-handle">{post.handle} · {post.time}</span>
                                        </div>
                                    </div>
                                    {post.isUserPost && (
                                        <button className="del-btn" onClick={() => handleDelete(post.id)}>
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                                <p className="post-body">
                                    {post.content}
                                </p>
                                <div className="post-actions-row">
                                    <button className="act-btn"><FaComment /> {post.replies}</button>
                                    <button className="act-btn" onClick={() => handleLike(post.id)}>
                                        <FaHeart /> {post.likes}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* Right Sidebar */}
                <aside className="sidebar-right">
                    <div className="dashboard-card follow-card">
                        <h4>Who to follow</h4>
                        <div className="follow-item">
                            <div className="f-avatar" style={{ background: '#fbbf24' }}><FaLeaf /></div>
                            <div className="f-info">
                                <strong>GreenLife</strong>
                                <span>@greenlife_</span>
                            </div>
                            <button className="btn-follow">+</button>
                        </div>
                        <div className="follow-item">
                            <div className="f-avatar" style={{ background: '#6ee7b7' }}><FaTint /></div>
                            <div className="f-info">
                                <strong>OceanClean</strong>
                                <span>@oceanclean</span>
                            </div>
                            <button className="btn-follow">+</button>
                        </div>
                        <div className="show-more">Show more</div>
                    </div>
                </aside>

            </div>
        </div>
    );
}



