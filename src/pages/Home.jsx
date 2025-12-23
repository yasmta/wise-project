import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaGlobeAmericas, FaLeaf, FaStar, FaArrowRight, FaUsers } from 'react-icons/fa';
import './Home.css';

export default function Home() {
    const { t } = useLanguage();

    return (
        <div className="home-page fade-in">

            {/* 1. Pastel "Astron" Hero */}
            <section className="astron-hero container">
                <div className="hero-text-side">
                    <span className="overline">PROJECT WISE • 2025</span>
                    <h1>THE OZONE <br /> INITIATIVE</h1>
                    <p>
                        {t('home_subtitle') || "Join the global mission to heal our atmosphere. We combine education, gamification, and community action to make a real difference."}
                    </p>
                    <div className="hero-breadcrumbs">
                        <span>Home</span> &gt; <span className="active">Mission Control</span>
                    </div>
                </div>

                {/* Visual Side: "Planet" made of gradients */}
                <div className="hero-visual-side">
                    <div className="planet-circle-pastel">
                        <div className="planet-inner">
                            <span className="big-stat">-50%</span>
                            <span className="stat-desc">Ozone Loss</span>
                        </div>
                    </div>
                    {/* Floating Cards for "Space" feel but flat design */}
                    <div className="floating-card c1">
                        <FaLeaf /> <span>Eco-Friendly</span>
                    </div>
                    <div className="floating-card c2">
                        <FaUsers /> <span>Community</span>
                    </div>
                </div>
            </section>

            {/* 2. "Who We Are" Split Section */}
            <section className="astron-section container split-layout">
                <div className="split-image-container">
                    <div className="image-block-pastel"></div>
                </div>
                <div className="split-content">
                    <span className="section-subtitle">Who We Are</span>
                    <h2>A Community of <br /> Guardians</h2>
                    <p>
                        We are a collective of individuals committed to restoring the ozone layer.
                        Through daily challenges and collective action, we turn small habits into global impact.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <div className="f-icon"><FaUsers /></div>
                            <div className="f-text">
                                <strong>Community Driven</strong>
                                <span>Join thousands of others.</span>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="f-icon"><FaGlobeAmericas /></div>
                            <div className="f-text">
                                <strong>Global Impact</strong>
                                <span>Real world changes.</span>
                            </div>
                        </div>
                    </div>

                    <Link to="/informacion" className="btn btn-primary btn-pill">
                        Get Started <FaArrowRight />
                    </Link>
                </div>
            </section>

            {/* 3. Stats Section (Pastel Stripe) */}
            <section className="astron-stats">
                <div className="container stats-grid">
                    <div className="stat-box">
                        <span className="stat-number">2,950+</span>
                        <span className="stat-label">Active Guardians</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-number">12</span>
                        <span className="stat-label">Years To Recovery</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-number">5</span>
                        <span className="stat-label">Continents</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-number">24/7</span>
                        <span className="stat-label">Monitoring</span>
                    </div>
                </div>
            </section>

            {/* 4. CTA Section */}
            <section className="astron-cta">
                <div className="cta-content container">
                    <h2>Ready to explore with us?</h2>
                    <p>Start your journey, earn rewards, and protect the planet.</p>
                    <Link to="/retos" className="btn btn-secondary btn-lg">
                        Join Now
                    </Link>
                </div>
            </section>

        </div>
    );
}

