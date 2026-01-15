import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import './Header.css';

// Import Flags
import flagES from '../assets/flags/es.svg';
import flagEN from '../assets/flags/en.svg';
import flagRO from '../assets/flags/ro.svg';
import flagIT from '../assets/flags/it.svg';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { user, logout, isAuthenticated } = useAuth();
    const langMenuRef = useRef(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Click outside handler for language menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
                setIsLangMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { name: t('nav_home'), path: '/' },
        { name: t('nav_info'), path: '/informacion' },
        { name: t('nav_challenges'), path: '/challenges' },
        { name: t('nav_ranking'), path: '/ranking' },
        { name: t('nav_community'), path: '/comunidad' },
    ];

    const changeLang = (lang) => {
        setLanguage(lang);
        setIsLangMenuOpen(false);
    };

    const getFlag = (lang) => {
        switch (lang) {
            case 'es': return flagES;
            case 'en': return flagEN;
            case 'ro': return flagRO;
            case 'it': return flagIT;
            default: return flagES;
        }
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
                                <button onClick={() => setShowLogin(true)} className="btn-auth">{t('header_login')}</button>
                                <button onClick={() => setShowRegister(true)} className="btn-auth">{t('header_register')}</button>
                            </div>
                        )}

                        {/* Language Dropdown */}
                        <div className="lang-dropdown-container" ref={langMenuRef}>
                            <button
                                className="lang-toggle-btn"
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                title="Select Language"
                            >
                                <img src={getFlag(language)} alt={language} className="flag-icon" />
                            </button>

                            {isLangMenuOpen && (
                                <div className="lang-dropdown-menu">
                                    <button className="lang-option" onClick={() => changeLang('es')} title="Español">
                                        <img src={flagES} alt="ES" className="flag-icon" />
                                    </button>
                                    <button className="lang-option" onClick={() => changeLang('en')} title="English">
                                        <img src={flagEN} alt="EN" className="flag-icon" />
                                    </button>
                                    <button className="lang-option" onClick={() => changeLang('ro')} title="Română">
                                        <img src={flagRO} alt="RO" className="flag-icon" />
                                    </button>
                                    <button className="lang-option" onClick={() => changeLang('it')} title="Italiano">
                                        <img src={flagIT} alt="IT" className="flag-icon" />
                                    </button>
                                </div>
                            )}
                        </div>

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

            {showLogin && (
                <LoginModal onClose={() => setShowLogin(false)} onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />
            )}
            {showRegister && (
                <RegisterModal onClose={() => setShowRegister(false)} onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />
            )}
        </>
    );
}
