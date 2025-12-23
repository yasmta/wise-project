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
        { name: t('nav_challenges'), path: '/retos' },
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

                    <div className="header-controls">
                        {isAuthenticated ? (
                            <div className="user-info">
                                <span>{user.username} <small>({user.points} pts)</small></span>
                                <button onClick={logout} className="btn-logout">Logout</button>
                            </div>
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
                </div>
            </header>

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
