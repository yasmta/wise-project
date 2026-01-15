import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
    FaBars, FaTimes, FaArrowUp, FaChartLine, FaGlobeAmericas, FaLeaf, FaShieldAlt,
    FaQuoteLeft, FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaIndustry, FaTable, FaChevronDown, FaCircle
} from 'react-icons/fa';
import './Information.css';

// Import Static Charts
import chartOzone from '../assets/images/chart_ozone.png';
import chartHole from '../assets/images/chart_hole.png';
import chartEmissions from '../assets/images/chart_emissions.png';
import chartConsumption from '../assets/images/chart_consumption.png';

export default function Information() {
    const { t } = useLanguage();
    const [activeSection, setActiveSection] = useState('summary');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Scroll spy
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['summary', 'intro', 'exploration', 'analysis', 'conclusions'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 400) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="info-modern-page fade-in">
            {/* 1. IMMERSIVE HERO: The Story Cover */}
            <div className="immersive-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content-story container fade-in-up">
                    <span className="story-tag">{t('info_story_tag')}</span>
                    <h1 dangerouslySetInnerHTML={{ __html: t('info_story_title') }}></h1>
                    <p className="story-lead">
                        {t('info_story_lead')}
                    </p>
                    <div className="hero-scroll-indicator" onClick={() => scrollTo('summary')}>
                        <span>{t('info_start_reading')}</span>
                        <FaArrowUp style={{ transform: 'rotate(180deg)' }} />
                    </div>
                </div>
            </div>

            <div className="mobile-index-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <span>{t('info_index_title')}</span>
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>

            <div className="info-layout container">

                {/* SIDEBAR INDEX */}
                <aside className={`info-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
                    <div className="sidebar-glass">
                        <h3>Capítulos</h3>
                        <nav>
                            <ul>
                                <li className={activeSection === 'summary' ? 'active' : ''} onClick={() => scrollTo('summary')}>
                                    <span className="idx-num">I</span> {t('info_chap_project')}
                                </li>
                                <li className={activeSection === 'intro' ? 'active' : ''} onClick={() => scrollTo('intro')}>
                                    <span className="idx-num">II</span> {t('info_chap_problem')}
                                </li>
                                <li className={activeSection === 'exploration' ? 'active' : ''} onClick={() => scrollTo('exploration')}>
                                    <span className="idx-num">III</span> {t('info_chap_data')}
                                </li>
                                <li className={activeSection === 'analysis' ? 'active' : ''} onClick={() => scrollTo('analysis')}>
                                    <span className="idx-num">IV</span> {t('info_chap_analysis')}
                                </li>
                                <li className={activeSection === 'conclusions' ? 'active' : ''} onClick={() => scrollTo('conclusions')}>
                                    <span className="idx-num">V</span> {t('info_chap_future')}
                                </li>
                            </ul>
                        </nav>
                        <div className="sidebar-footer">
                            <Link to="/challenges" className="btn-mini">
                                {t('info_btn_challenges')} <FaArrowUp style={{ transform: 'rotate(45deg)' }} />
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="info-content-story">

                    {/* 2. RESUMEN: The Hook */}
                    <section id="summary" className="doc-section scroll-reveal">
                        <div className="glass-card story-card">
                            <div className="card-header-icon"><FaGlobeAmericas /></div>
                            <h2>{t('info_sum_title')}</h2>
                            <p className="lead-text">
                                {t('info_sum_p1')}
                            </p>
                            <p>
                                {t('info_sum_p2')}
                            </p>
                        </div>
                    </section>

                    {/* 3. INTRODUCCION: The Context */}
                    <section id="intro" className="doc-section scroll-reveal">
                        <div className="section-title-wrapper">
                            <h2>{t('info_intro_title')}</h2>
                            <p className="section-subtitle">{t('info_intro_subtitle')}</p>
                        </div>

                        <div className="glass-card story-card">
                            <div className="story-block">
                                <h3>{t('info_intro_what_title')}</h3>
                                <p>
                                    {t('info_intro_what_p1')}
                                </p>
                                <p>
                                    {t('info_intro_what_p2')}
                                </p>

                                <div className="pull-quote">
                                    <FaQuoteLeft className="quote-icon" />
                                    <p>
                                        {t('info_intro_quote')}
                                    </p>
                                </div>

                                <h3 className="mt-4">{t('info_intro_gases_title')}</h3>
                                <p>
                                    {t('info_intro_gases_p1')}
                                </p>

                                <div className="details-accordion mt-4">
                                    <details>
                                        <summary>
                                            <div className="summary-trigger">
                                                <FaLightbulb className="mr-2" />
                                                <span>{t('info_accord_chem_title')}</span>
                                                <FaChevronDown className="accordion-chevron" />
                                            </div>
                                        </summary>
                                        {/* Applied .chemical-deep-dive */}
                                        <div className="chemical-deep-dive">
                                            <p className="mb-2">
                                                {t('info_accord_chem_p1')}
                                            </p>
                                            <p className="mb-2" dangerouslySetInnerHTML={{ __html: t('info_accord_chem_p2') }}>
                                            </p>
                                            <p dangerouslySetInnerHTML={{ __html: t('info_accord_chem_p3') }}>
                                            </p>
                                        </div>
                                    </details>
                                </div>
                            </div>

                            <div className="story-grid-2 mt-6">
                                <div className="insight-box warning">
                                    <div className="box-icon"><FaExclamationTriangle /></div>
                                    <h4>{t('info_rel_title')}</h4>
                                    <ul className="info-list-sm">
                                        <li>{t('info_rel_li1')}</li>
                                        <li>{t('info_rel_li2')}</li>
                                        <li>{t('info_rel_li3')}</li>
                                    </ul>
                                </div>
                                <div className="insight-box danger">
                                    <div className="box-icon"><FaShieldAlt /></div>
                                    <h4>{t('info_glob_title')}</h4>
                                    <p>
                                        {t('info_glob_p')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. EXPLORACION: The Evidence */}
                    <section id="exploration" className="doc-section scroll-reveal">
                        <div className="section-title-wrapper">
                            <h2>{t('info_evid_title')}</h2>
                            <p className="section-subtitle">{t('info_evid_subtitle')}</p>
                        </div>

                        <div className="glass-card story-card">
                            <p>{t('info_evid_intro')}</p>

                            <div className="file-cards-grid">
                                <div className="file-card">
                                    <div className="fc-icon"><FaChartLine /></div>
                                    <strong>{t('info_card_conc')}</strong> <span className="text-sm">{t('info_card_conc_sub')}</span>
                                    <p className="text-xs">{t('info_card_conc_desc')}</p>
                                </div>
                                <div className="file-card">
                                    <div className="fc-icon"><FaCircle /></div>
                                    <strong>{t('info_card_hole')}</strong> <span className="text-sm">{t('info_card_hole_sub')}</span>
                                    <p className="text-xs">{t('info_card_hole_desc')}</p>
                                </div>
                                <div className="file-card">
                                    <div className="fc-icon"><FaIndustry /></div>
                                    <strong>{t('info_card_emis')}</strong> <span className="text-sm">{t('info_card_emis_sub')}</span>
                                    <p className="text-xs">{t('info_card_emis_desc')}</p>
                                </div>
                                <div className="file-card">
                                    <div className="fc-icon"><FaGlobeAmericas /></div>
                                    <strong>{t('info_card_cons')}</strong> <span className="text-sm">{t('info_card_cons_sub')}</span>
                                    <p className="text-xs">{t('info_card_cons_desc')}</p>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-white/70">
                                <em>{t('info_evid_note')}</em>
                            </div>

                            <div className="details-accordion">
                                <details>
                                    <summary>
                                        <div className="summary-trigger">
                                            <FaTable className="mr-2" />
                                            <span>{t('info_dict_trigger')}</span>
                                            <FaChevronDown className="accordion-chevron" />
                                        </div>
                                    </summary>
                                    <div className="table-wrapper mt-4">
                                        <table className="data-table">
                                            <thead><tr><th>{t('info_dict_col')}</th><th>{t('info_dict_desc')}</th></tr></thead>
                                            <tbody>
                                                <tr><td>Minimum daily concentration</td><td>{t('info_dict_r1_v')}</td></tr>
                                                <tr><td>Maximum ozone hole area</td><td>{t('info_dict_r2_v')}</td></tr>
                                                <tr><td>Emisiones Naturales</td><td>{t('info_dict_r3_v')}</td></tr>
                                                <tr><td>Emisiones Antropogénicas</td><td>{t('info_dict_r4_v')}</td></tr>
                                                <tr><td>Consumo (Tonnes)</td><td>{t('info_dict_r5_v')}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </section>

                    {/* 5. ANALISIS: The Truth Revealed */}
                    <section id="analysis" className="doc-section scroll-reveal">
                        <div className="section-title-wrapper">
                            <h2>{t('info_anal_title')}</h2>
                            <p className="section-subtitle">{t('info_anal_sub')}</p>
                        </div>

                        <div className="glass-card story-card">

                            {/* Insight Statistics */}
                            <div className="big-stats-row">
                                <div className="b-stat">
                                    <span className="bs-val">102 UD</span>
                                    <span className="bs-label">{t('info_stat_conc_label')}</span>
                                </div>
                                <div className="b-stat">
                                    <span className="bs-val">-99%</span>
                                    <span className="bs-label">{t('info_stat_cons_label')}</span>
                                </div>
                                <div className="b-stat">
                                    <span className="bs-val">29.9M</span>
                                    <span className="bs-label">{t('info_stat_area_label')}</span>
                                </div>
                            </div>

                            {/* Applied .stats-description-block */}
                            <div className="stats-description-block">
                                <h4><FaChartLine /> {t('info_desc_title')}</h4>
                                <ul className="styled-list">
                                    <li dangerouslySetInnerHTML={{ __html: t('info_desc_li1') }}></li>
                                    <li dangerouslySetInnerHTML={{ __html: t('info_desc_li2') }}></li>
                                    <li dangerouslySetInnerHTML={{ __html: t('info_desc_li3') }}></li>
                                </ul>

                                <div className="predictions-block">
                                    <h4>{t('info_pred_title')}</h4>
                                    <p className="predictions-text">
                                        {t('info_pred_text')}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <br />
                                <br />
                            </div>

                            {/* GRAPHS STORY */}
                            <div className="charts-story-layout mt-8">

                                <div className="chart-wrapper">
                                    <div className="chart-header">
                                        <h4>{t('info_graph_1_title')}</h4>
                                        <p>{t('info_graph_1_desc')}</p>
                                    </div>
                                    <img src={chartOzone} alt="Concentración de Ozono" />
                                </div>

                                <div className="chart-wrapper">
                                    <div className="chart-header">
                                        <h4>{t('info_graph_2_title')}</h4>
                                        <p>{t('info_graph_2_desc')}</p>
                                    </div>
                                    <img src={chartHole} alt="Superficie del Agujero" />
                                </div>

                                <div className="chart-wrapper">
                                    <div className="chart-header">
                                        <h4>{t('info_graph_3_title')}</h4>
                                        <p>{t('info_graph_3_desc')}</p>
                                    </div>
                                    <img src={chartEmissions} alt="Emisiones" />
                                </div>

                                <div className="chart-wrapper">
                                    <div className="chart-header">
                                        <h4>{t('info_graph_4_title')}</h4>
                                        <p>{t('info_graph_4_desc')}</p>
                                    </div>
                                    <img src={chartConsumption} alt="Consumo vs Superficie" />
                                </div>

                            </div>

                            <div className="interpretation-box">
                                <div className="ib-icon"><FaLightbulb /></div>
                                <div className="ib-content">
                                    <h4>{t('info_interp_title')}</h4>
                                    <p>
                                        {t('info_interp_text')}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* 6. CONCLUSIONES: Moving Forward */}
                    <section id="conclusions" className="doc-section scroll-reveal">
                        <div className="glass-card story-card highlight-card">
                            <h2>{t('info_conc_title')}</h2>
                            <p className="mb-6 text-center text-lg">
                                {t('info_conc_lead')}
                            </p>
                            <br />

                            <div className="conclusion-item">
                                <div className="ci-marker"><FaCheckCircle /></div>
                                <div className="ci-text" dangerouslySetInnerHTML={{ __html: t('info_conc_1') }}></div>
                            </div>

                            <div className="conclusion-item">
                                <div className="ci-marker"><FaLeaf /></div>
                                <div className="ci-text" dangerouslySetInnerHTML={{ __html: t('info_conc_2') }}></div>
                            </div>

                            <div className="conclusion-item">
                                <div className="ci-marker"><FaArrowUp /></div>
                                <div className="ci-text" dangerouslySetInnerHTML={{ __html: t('info_conc_3') }}></div>
                            </div>

                            {/* Applied .reflections-box */}
                            <div className="reflections-box">
                                <h3>{t('info_refl_title')}</h3>
                                <p>
                                    {t('info_refl_text')}
                                </p>
                                <div className="future-questions-list">
                                    <div className="question-card">
                                        <FaCheckCircle className="question-icon" /> <span>{t('info_q1')}</span>
                                    </div>
                                    <div className="question-card">
                                        <FaExclamationTriangle className="question-icon" /> <span>{t('info_q2')}</span>
                                    </div>
                                    <div className="question-card">
                                        <FaGlobeAmericas className="question-icon" /> <span>{t('info_q3')}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}
