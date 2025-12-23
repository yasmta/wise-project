import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaArrowRight, FaClock, FaGlobeAmericas, FaTemperatureLow, FaQuoteLeft } from 'react-icons/fa';
import './Information.css';

// Import Static Charts
import chartOzone from '../assets/images/chart_ozone.png';
import chartHole from '../assets/images/chart_hole.png';
import chartEmissions from '../assets/images/chart_emissions.png';
import chartConsumption from '../assets/images/chart_consumption.png';

export default function Information() {
    const { t } = useLanguage();
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        const date = new Date();
        setLastUpdated(date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }));
    }, []);

    return (
        <div className="hybrid-page fade-in">

            {/* 1. MAGAZINE TOP */}
            <header className="magazine-hero">
                <div className="container hero-content">
                    <span className="category-tag">Informe Especial</span>
                    <h1>{t('info_main_title')}</h1>
                    <div className="meta-info">
                        <span className="author">Por <strong>Yasmina Tamouh & Valeria Linares</strong></span>
                        <span className="separator">•</span>
                        <span className="date"><FaClock className="icon-sm" /> {lastUpdated}</span>
                    </div>
                    <p className="lead-text">{t('info_sec2_text')}</p>
                </div>
            </header>

            <div className="container content-wrapper">

                {/* 2. BENTO GRID */}
                <section className="bento-section">
                    <h2 className="section-label">Los Datos en Directo</h2>
                    <div className="bento-grid">

                        {/* Card 1: Ozone (Hero Data) */}
                        <div className="bento-card card-large">
                            <div className="card-content">
                                <div className="card-text" style={{ marginBottom: '1rem' }}>
                                    <h2>📉 {t('info_card1_title')}</h2>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                                        <p className="big-stat" style={{ color: '#4c1d95' }}>-50%</p>
                                        <p className="stat-desc" style={{ color: '#666', fontSize: '0.9rem' }}>
                                            Comparativa: Concentración <strong>Media</strong> (Lila) vs <strong>Mínima</strong> (Rosa).
                                        </p>
                                    </div>
                                </div>
                                <div className="chart-img-wrapper">
                                    <img src={chartOzone} alt="Gráfico Ozono" onClick={() => window.open(chartOzone)} />
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Hole (Square -> Wide) */}
                        <div className="bento-card card-wide">
                            <div className="icon-header">
                                <FaGlobeAmericas className="bento-icon pink" />
                                <h3 style={{ display: 'inline-block', marginLeft: '10px' }}>{t('info_card2_title')}</h3>
                            </div>
                            <div className="chart-img-wrapper mini">
                                <img src={chartHole} alt="Gráfico Agujero Ozono" onClick={() => window.open(chartHole)} />
                            </div>
                            <p className="card-footer-text" style={{ textAlign: 'center' }}>Superficie: Máxima (Lila) vs Media (Rosa)</p>
                        </div>

                        {/* Card 3: Emissions (Square -> Wide) */}
                        <div className="bento-card card-wide">
                            <div className="icon-header">
                                <FaTemperatureLow className="bento-icon red" />
                                <h3 style={{ display: 'inline-block', marginLeft: '10px' }}>{t('info_card3_title')}</h3>
                            </div>
                            <div className="chart-img-wrapper mini">
                                <img src={chartEmissions} alt="Gráfico Emisiones" onClick={() => window.open(chartEmissions)} />
                            </div>
                            <p className="card-footer-text" style={{ textAlign: 'center' }}>Emisiones: Totales (Lila) vs Naturales (Rosa)</p>
                        </div>

                        {/* Card 4: Consumption Scatter (Large) */}
                        <div className="bento-card card-large">
                            <div className="flex-col">
                                <div className="text-side" style={{ marginBottom: '1rem' }}>
                                    <h3>✅ {t('info_card4_title')}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                        Correlación: Consumo (X) vs Agujero (Y). <br />
                                        Cada punto Lila es un año. La línea Rosa es la tendencia.
                                    </p>
                                </div>
                                <div className="chart-img-wrapper" style={{ height: '300px' }}>
                                    <img src={chartConsumption} alt="Gráfico Dispersión Consumo" style={{ objectFit: 'contain' }} onClick={() => window.open(chartConsumption)} />
                                </div>
                            </div>
                        </div>

                        {/* Action */}
                        <Link to="/retos" className="bento-card card-action">
                            <div className="action-content">
                                <h3>¡Actúa Ahora!</h3>
                                <p>Ver Retos <FaArrowRight /></p>
                            </div>
                        </Link>

                    </div>
                </section>

                {/* 3. MAGAZINE BODY */}
                <article className="magazine-article">
                    <div className="columns-2">
                        <div className="col">
                            <h2>{t('info_sec3_title')}</h2>
                            <h3>{t('info_sec3_q1')}</h3>
                            <p>{t('info_sec3_a1')}</p>

                            <h3>{t('info_sec3_q2')}</h3>
                            <p>{t('info_sec3_a2')}</p>
                        </div>
                        <div className="col">
                            <div className="quote-box">
                                <FaQuoteLeft className="quote-icon" />
                                <p>{t('info_sec3_a3')}</p>
                            </div>

                            <h3>{t('info_sec5_interp_title')}</h3>
                            <p>{t('info_sec5_interp_text')}</p>
                        </div>
                    </div>

                    <div className="analysis-block">
                        <h2>{t('info_sec6_title')}</h2>
                        <div className="analysis-grid">
                            <div className="analysis-item">
                                <h4>{t('info_sec6_learn_title')}</h4>
                                <p>{t('info_sec6_learn_text')}</p>
                            </div>
                            <div className="analysis-item">
                                <h4>{t('info_sec6_ozone_title')}</h4>
                                <p>{t('info_sec6_ozone_text')}</p>
                            </div>
                            <div className="analysis-item highlight">
                                <h4>{t('info_sec6_future_title')}</h4>
                                <p>{t('info_sec6_future_text')}</p>
                            </div>
                        </div>
                    </div>
                </article>

            </div>
        </div>
    );
}
