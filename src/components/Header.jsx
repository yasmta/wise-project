import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import './Header.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { user, logout, isAuthenticated } = useAuth();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = [
        { name: t('nav_home'), path: '/' },
        { name: t('nav_info'), path: '/informacion' },
        { name: t('nav_challenges'), path: '/challenges' },
        { name: t('nav_ranking'), path: '/ranking' },
        { name: t('nav_community'), path: '/comunidad' },
    ];

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <>
            <header className="site-header">
                <div className="container header-container">
                    <Link to="/" className="logo">WISE</Link>

                    {/* Desktop Nav - Centered */}
                    <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                        <ul>
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) => isActive ? 'active' : ''}
                                        onClick={closeMenu}
                                    >
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="header-controls">
                        {isAuthenticated ? (
                            <NavLink to={`/profile/${user.username}`} className="user-profile-link">
                                <div className="user-avatar-container">
                                    {user.username[0].toUpperCase()}
                                </div>
                                <div className="user-meta">
                                    <span className="user-name">{user.username}</span>
                                    <span className="user-points-badge">
                                        <span className="points-dot"></span>
                                        {user.points} XP
                                    </span>
                                </div>
                            </NavLink>
                        ) : (
                            <div className="auth-buttons">
                                <button onClick={() => setShowLogin(true)} className="btn-auth">Login</button>
                                <button onClick={() => setShowRegister(true)} className="btn-auth">Register</button>
                            </div>
                        )}

                        {/* Language Selector */}
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="lang-select"
                        >
                            <option value="es">🇪🇸 ES</option>
                            <option value="ca">🟡 CA</option>
                            <option value="en">🇬🇧 EN</option>
                            <option value="ro">🇷🇴 RO</option>
                            <option value="it">🇮🇹 IT</option>
                        </select>

                        <button
                            className="mobile-menu-btn"
                            onClick={toggleMenu}
                            aria-label="Toggle navigation"
                        >
                            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ...modals... */}

            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
                />
            )}

            {showRegister && (
                <RegisterModal
                    onClose={() => setShowRegister(false)}
                    onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
                />
            )}
        </>
    );
}
