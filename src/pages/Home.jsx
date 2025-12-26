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
                    <span className="overline">PROJECT WISE • 2025</span>
                    <h1>THE OZONE <br /> INITIATIVE</h1>
                    <p>
                        {t('home_subtitle') || "Join the global mission to heal our atmosphere. We combine education, gamification, and community action to make a real difference."}
                    </p>

                    <div className="hero-actions">
                        <Link to="/informacion" className="btn btn-primary btn-lg shine-effect">
                            Start Mission <FaArrowRight />
                        </Link>
                        <Link to="/retos" className="btn btn-secondary btn-lg">
                            View Challenges
                        </Link>
                    </div>

                    <div className="hero-stats-mini">
                        <div className="mini-stat">
                            <strong>2.9k+</strong> <span>Guardians</span>
                        </div>
                        <div className="mini-stat">
                            <strong>50%</strong> <span>Recovery</span>
                        </div>
                    </div>
                </div>

                {/* Visual Side: "Planet" made of gradients */}
                <div className="hero-visual-side fade-in-up delay-200">
                    <div className="planet-circle-pastel">
                        <div className="planet-inner">
                            <span className="big-stat">-50%</span>
                            <span className="stat-desc">Ozone Loss</span>
                        </div>
                    </div>
                    {/* Floating Cards */}
                    <div className="floating-card c1">
                        <FaLeaf /> <span>Eco-Friendly</span>
                    </div>
                    <div className="floating-card c2">
                        <FaUsers /> <span>Community</span>
                    </div>
                    <div className="floating-card c3">
                        <FaShieldAlt /> <span>Verified</span>
                    </div>
                </div>
            </section>

            {/* 2. "Who We Are" Split Section */}
            <section className="astron-section container split-layout">
                <div className="split-visual fade-in-up delay-100">
                    <div className="glass-collage">
                        <div className="collage-card main">
                            <FaGlobeAmericas className="collage-icon" />
                            <h3>Global Impact</h3>
                        </div>
                        <div className="collage-card sub1">
                            <span>+120 Countries</span>
                        </div>
                        <div className="collage-card sub2">
                            <span>Real-time Data</span>
                        </div>
                    </div>
                </div>

                <div className="split-content fade-in-up delay-200">
                    <span className="section-subtitle">Who We Are</span>
                    <h2>A Community of <br /> Guardians</h2>
                    <p>
                        We are a collective of individuals committed to restoring the ozone layer.
                        Through daily challenges and collective action, we turn small habits into global impact.
                    </p>

                    <div className="feature-grid">
                        <div className="feature-item">
                            <div className="f-icon"><FaUsers /></div>
                            <div className="f-text">
                                <strong>Community Driven</strong>
                                <span>Join thousands of others.</span>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="f-icon"><FaChartLine /></div>
                            <div className="f-text">
                                <strong>Data Backed</strong>
                                <span>Verified scientific sources.</span>
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
                        <span className="stat-label">Active Guardians</span>
                    </div>
                    <div className="stat-card-glass pop-in delay-200">
                        <div className="stat-icon-bg pink"><FaChartLine /></div>
                        <span className="stat-number">12</span>
                        <span className="stat-label">Years To Recovery</span>
                    </div>
                    <div className="stat-card-glass pop-in delay-300">
                        <div className="stat-icon-bg blue"><FaGlobeAmericas /></div>
                        <span className="stat-number">5</span>
                        <span className="stat-label">Continents</span>
                    </div>
                    <div className="stat-card-glass pop-in delay-400">
                        <div className="stat-icon-bg green"><FaShieldAlt /></div>
                        <span className="stat-number">24/7</span>
                        <span className="stat-label">Monitoring</span>
                    </div>
                </div>
            </section>

            {/* 4. CTA Section REDESIGNED: Portal Style */}
            <section className="astron-cta">
                <div className="container">
                    <div className="cta-portal-glass scale-up-on-scroll">
                        <div className="portal-content">
                            <div className="icon-crown"><FaRocket /></div>
                            <h2>Ready to explore with us?</h2>
                            <p>Start your journey, earn rewards, and protect the planet.</p>
                            <Link to="/retos" className="btn btn-primary btn-xl shine-effect">
                                Join Now <FaArrowRight />
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
