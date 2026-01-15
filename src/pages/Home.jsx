import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaGlobeAmericas, FaLeaf, FaArrowRight, FaUsers, FaChartLine, FaShieldAlt, FaRocket } from 'react-icons/fa';
import './Home.css';

export default function Home() {
    const { t } = useLanguage();

    return (
        <div className="home-page fade-in">
            {/* Background Ambient Effect */}
            <div className="ambient-glow"></div>

            {/* 1. Pastel "Astron" Hero */}
            <section className="astron-hero container">
                <div className="hero-text-side fade-in-up delay-100">
                    <span className="overline">{t('home_overline')}</span>
                    <h1 dangerouslySetInnerHTML={{ __html: t('home_title') }}></h1>
                    <p>
                        {t('home_subtitle')}
                    </p>

                    <div className="hero-actions">
                        <Link to="/informacion" className="btn btn-primary btn-lg shine-effect" style={{ marginLeft: '-40px' }}>
                            {t('home_btn_start')} <FaArrowRight />
                        </Link>
                        <Link to="/challenges" className="btn btn-secondary btn-lg" style={{ marginLeft: '-40px' }}>
                            {t('home_btn_challenges')}
                        </Link>
                    </div>

                    <div className="hero-stats-mini">
                        <div className="mini-stat">
                            <strong>2.9k+</strong> <span>{t('stat_guardians')}</span>
                        </div>
                        <div className="mini-stat">
                            <strong>50%</strong> <span>{t('stat_recovery')}</span>
                        </div>
                    </div>
                </div>

                {/* Visual Side: "Planet" made of gradients */}
                <div className="hero-visual-side fade-in-up delay-200">
                    <div className="planet-circle-pastel">
                        <div className="planet-inner">
                            <span className="big-stat">-50%</span>
                            <span className="stat-desc">{t('stat_ozone_loss')}</span>
                        </div>
                    </div>
                    {/* Floating Cards */}
                    <div className="floating-card c1">
                        <FaLeaf /> <span>{t('card_eco')}</span>
                    </div>
                    <div className="floating-card c2">
                        <FaUsers /> <span>{t('card_community')}</span>
                    </div>
                    <div className="floating-card c3">
                        <FaShieldAlt /> <span>{t('card_verified')}</span>
                    </div>
                </div>
            </section>

            {/* 2. "Who We Are" Split Section */}
            <section className="astron-section container split-layout">
                <div className="split-visual fade-in-up delay-100">
                    <div className="glass-collage">
                        <div className="collage-card main">
                            <FaGlobeAmericas className="collage-icon" />
                            <h3>{t('impact_global')}</h3>
                        </div>
                        <div className="collage-card sub1">
                            <span>{t('impact_countries')}</span>
                        </div>
                        <div className="collage-card sub2">
                            <span>{t('impact_data')}</span>
                        </div>
                    </div>
                </div>

                <div className="split-content fade-in-up delay-200">
                    <span className="section-subtitle">{t('who_we_are')}</span>
                    <h2 dangerouslySetInnerHTML={{ __html: t('community_guardians') }}></h2>
                    <p>
                        {t('about_text')}
                    </p>

                    <div className="feature-grid">
                        <div className="feature-item">
                            <div className="f-icon"><FaUsers /></div>
                            <div className="f-text">
                                <strong>{t('feature_community')}</strong>
                                <span>{t('feature_community_desc')}</span>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="f-icon"><FaChartLine /></div>
                            <div className="f-text">
                                <strong>{t('feature_data')}</strong>
                                <span>{t('feature_data_desc')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Stats Section REDESIGNED: Floating Glass Cards */}
            <section className="stats-section-container">
                <div className="container stats-floating-grid">
                    {/* Individual Glass Cards */}
                    <div className="stat-card-glass pop-in delay-100">
                        <div className="stat-icon-bg purple"><FaUsers /></div>
                        <span className="stat-number">2,950+</span>
                        <span className="stat-label">{t('active_guardians')}</span>
                    </div>
                    <div className="stat-card-glass pop-in delay-200">
                        <div className="stat-icon-bg pink"><FaChartLine /></div>
                        <span className="stat-number">12</span>
                        <span className="stat-label">{t('years_recovery')}</span>
                    </div>
                    <div className="stat-card-glass pop-in delay-300">
                        <div className="stat-icon-bg blue"><FaGlobeAmericas /></div>
                        <span className="stat-number">5</span>
                        <span className="stat-label">{t('continents')}</span>
                    </div>
                    <div className="stat-card-glass pop-in delay-400">
                        <div className="stat-icon-bg green"><FaShieldAlt /></div>
                        <span className="stat-number">24/7</span>
                        <span className="stat-label">{t('monitoring')}</span>
                    </div>
                </div>
            </section>

            {/* 4. CTA Section REDESIGNED: Portal Style */}
            <section className="astron-cta">
                <div className="container">
                    <div className="cta-portal-glass scale-up-on-scroll">
                        <div className="portal-content">
                            <div className="icon-crown"><FaRocket /></div>
                            <h2>{t('home_ready')}</h2>
                            <p>{t('home_start_journey')}</p>
                            <Link to="/challenges" className="btn btn-primary btn-xl shine-effect">
                                {t('home_join_now')} <FaArrowRight />
                            </Link>
                        </div>
                        {/* Decorative background elements inside the glass */}
                        <div className="portal-glow"></div>
                        <div className="portal-circle"></div>
                    </div>
                </div>
            </section>

        </div>
    );
}
