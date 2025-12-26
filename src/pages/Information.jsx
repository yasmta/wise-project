import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
                    <span className="story-tag">Informe Especial 2025</span>
                    <h1>La Tierra tiene un Escudo:<br />La Historia de su Recuperación</h1>
                    <p className="story-lead">
                        Cómo la humanidad provocó una crisis global invisible y cómo un acuerdo sin precedentes
                        nos está salvando del desastre. Un análisis basado en 40 años de datos de la NASA.
                    </p>
                    <div className="hero-scroll-indicator" onClick={() => scrollTo('summary')}>
                        <span>Comenzar la lectura</span>
                        <FaArrowUp style={{ transform: 'rotate(180deg)' }} />
                    </div>
                </div>
            </div>

            <div className="mobile-index-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <span>Índice de la Historia</span>
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
                                    <span className="idx-num">I</span> El Proyecto
                                </li>
                                <li className={activeSection === 'intro' ? 'active' : ''} onClick={() => scrollTo('intro')}>
                                    <span className="idx-num">II</span> El Problema
                                </li>
                                <li className={activeSection === 'exploration' ? 'active' : ''} onClick={() => scrollTo('exploration')}>
                                    <span className="idx-num">III</span> Los Datos
                                </li>
                                <li className={activeSection === 'analysis' ? 'active' : ''} onClick={() => scrollTo('analysis')}>
                                    <span className="idx-num">IV</span> Análisis
                                </li>
                                <li className={activeSection === 'conclusions' ? 'active' : ''} onClick={() => scrollTo('conclusions')}>
                                    <span className="idx-num">V</span> Futuro
                                </li>
                            </ul>
                        </nav>
                        <div className="sidebar-footer">
                            <Link to="/retos" className="btn-mini">
                                Unirse a la Acción <FaArrowUp style={{ transform: 'rotate(45deg)' }} />
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
                            <h2>En Resumen: ¿Qué hemos descubierto?</h2>
                            <p className="lead-text">
                                Hemos viajado atrás en el tiempo a través de cuatro archivos históricos de la NASA y datos mundiales.
                                Nuestro objetivo: entender la cicatriz del cielo.
                            </p>
                            <p>
                                ¿Han funcionado realmente los esfuerzos internacionales? ¿O solo nos hemos contado una bonita mentira?
                                Analizamos la concentración de ozono, el tamaño del agujero y, sobre todo, nuestras propias emisiones
                                para responder si el peligro ha pasado o si el futuro sigue siendo incierto.
                            </p>
                        </div>
                    </section>

                    {/* 3. INTRODUCCION: The Context */}
                    <section id="intro" className="doc-section scroll-reveal">
                        <div className="section-title-wrapper">
                            <h2>El Enemigo Invisible</h2>
                            <p className="section-subtitle">Entendiendo el problema del agujero de ozono</p>
                        </div>

                        <div className="glass-card story-card">
                            <div className="story-block">
                                <h3>¿Qué es realmente este agujero?</h3>
                                <p>
                                    Imagina un escudo invisible en la estratosfera que absorbe la radiación solar mortal. Esa es la capa de ozono.
                                    Pero la hemos dañado.
                                </p>
                                <p>
                                    Ciertos gases liberados por nosotros han "devorado" partes de este escudo, creando zonas de muy baja concentración
                                    (agujeros), especialmente sobre la Antártida. No es un agujero físico, es una debilidad en nuestra defensa.
                                </p>

                                <div className="pull-quote">
                                    <FaQuoteLeft className="quote-icon" />
                                    <p>
                                        Gracias al Protocolo de Montreal (1987), el escudo está sanando.
                                        Es el mayor éxito ambiental de la historia.
                                    </p>
                                </div>
                            </div>

                            <div className="story-grid-2">
                                <div className="insight-box warning">
                                    <div className="box-icon"><FaExclamationTriangle /></div>
                                    <h4>Los Culpables: CFCs</h4>
                                    <p>
                                        Clorofluorocarbonos, halones... Nombres complejos para gases cotidianos usados en antiguos
                                        sprays, aires acondicionados y extintores. La luz solar los rompe y liberan cloro, el asesino del ozono.
                                    </p>
                                </div>
                                <div className="insight-box danger">
                                    <div className="box-icon"><FaShieldAlt /></div>
                                    <h4>¿Por qué importa?</h4>
                                    <p>
                                        Sin este escudo, aumentan los cánceres de piel y cataratas, y se destruye el fitoplancton,
                                        la base de la vida marina. Es un problema de supervivencia global.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. EXPLORACION: The Evidence */}
                    <section id="exploration" className="doc-section scroll-reveal">
                        <div className="section-title-wrapper">
                            <h2>La Evidencia</h2>
                            <p className="section-subtitle">Exploración inicial de los archivos</p>
                        </div>

                        <div className="glass-card story-card">
                            <p>Para esta investigación, no hemos especulado. Hemos utilizado datos "crudos" oficiales:</p>

                            <div className="file-cards-grid">
                                <div className="file-card">
                                    <div className="fc-icon"><FaChartLine /></div>
                                    <strong>Concentración</strong> <span className="text-sm">NASA 1979-2020</span>
                                </div>
                                <div className="file-card">
                                    <div className="fc-icon"><FaCircle /></div>
                                    <strong>Superficie Agujero</strong> <span className="text-sm">NASA 1979-2020</span>
                                </div>
                                <div className="file-card">
                                    <div className="fc-icon"><FaIndustry /></div>
                                    <strong>Emisiones</strong> <span className="text-sm">1961-2014</span>
                                </div>
                                <div className="file-card">
                                    <div className="fc-icon"><FaGlobeAmericas /></div>
                                    <strong>Consumo País</strong> <span className="text-sm">1989-2014</span>
                                </div>
                            </div>

                            <div className="details-accordion">
                                <details>
                                    <summary>
                                        <div className="summary-trigger">
                                            <FaTable className="mr-2" />
                                            <span>Explorar detalles técnicos (Diccionario de Datos)</span>
                                            <FaChevronDown className="accordion-chevron" />
                                        </div>
                                    </summary>
                                    <div className="table-wrapper mt-4">
                                        <table className="data-table">
                                            <thead><tr><th>Dato</th><th>Significado</th></tr></thead>
                                            <tbody>
                                                <tr><td>Minimum daily concentration</td><td>El "grosor" mínimo del escudo ese día (U. Dobson).</td></tr>
                                                <tr><td>Maximum ozone hole area</td><td>La extensión máxima del daño (km²) ese año.</td></tr>
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
                            <h2>La Verdad en los Datos</h2>
                            <p className="section-subtitle">Análisis visual (1979-2020)</p>
                        </div>

                        <div className="glass-card story-card">

                            {/* Insight Statistics */}
                            <div className="big-stats-row">
                                <div className="b-stat">
                                    <span className="bs-val">-50%</span>
                                    <span className="bs-label">Caída de Ozono (1979-2020)</span>
                                </div>
                                <div className="b-stat">
                                    <span className="bs-val">99%</span>
                                    <span className="bs-label">Reducción de Consumo</span>
                                </div>
                                <div className="b-stat">
                                    <span className="bs-val">29M</span>
                                    <span className="bs-label">km² Máxima Extensión</span>
                                </div>
                            </div>

                            {/* GRAPHS STORY */}
                            <div className="charts-story-layout">

                                <div className="chart-wrapper">
                                    <div className="chart-header">
                                        <h4>1. El Colapso del Escudo</h4>
                                        <p>La concentración de Ozono cayó en picado en los 80.</p>
                                    </div>
                                    <img src={chartOzone} alt="Concentración de Ozono" />
                                </div>

                                <div className="chart-wrapper">
                                    <div className="chart-header">
                                        <h4>2. La Herida Creciente</h4>
                                        <p>El agujero creció hasta 2006. Ahora, empieza a estabilizarse.</p>
                                    </div>
                                    <img src={chartHole} alt="Superficie del Agujero" />
                                </div>

                                <div className="chart-wrapper">
                                    <div className="chart-header">
                                        <h4>3. Humanos vs Naturaleza</h4>
                                        <p>Las emisiones naturales son fijas. Nosotros causamos el pico.</p>
                                    </div>
                                    <img src={chartEmissions} alt="Emisiones" />
                                </div>

                                <div className="chart-wrapper">
                                    <div className="chart-header">
                                        <h4>4. Causa y Efecto</h4>
                                        <p>Al bajar el consumo (eje X), el agujero deja de crecer.</p>
                                    </div>
                                    <img src={chartConsumption} alt="Consumo vs Superficie" />
                                </div>

                            </div>

                            <div className="interpretation-box">
                                <div className="ib-icon"><FaLightbulb /></div>
                                <div className="ib-content">
                                    <h4>Lectura Clave</h4>
                                    <p>
                                        Aunque dejamos de emitir gases dañinos casi por completo (graf. 4), la atmósfera responde muy lento.
                                        El daño de los 80 tarda décadas en repararse. Pero la estabilización es innegable:
                                        <strong> Las políticas funcionan.</strong>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* 6. CONCLUSIONES: Moving Forward */}
                    <section id="conclusions" className="doc-section scroll-reveal">
                        <div className="glass-card story-card highlight-card">
                            <h2>Conclusiones: ¿Qué hemos aprendido?</h2>

                            <div className="conclusion-item">
                                <div className="ci-marker"><FaCheckCircle /></div>
                                <div className="ci-text">
                                    <strong>No es inmediato.</strong> Apagar el grifo de la contaminación no limpia el aire al instante.
                                    La inercia climática es de décadas.
                                </div>
                            </div>

                            <div className="conclusion-item">
                                <div className="ci-marker"><FaLeaf /></div>
                                <div className="ci-text">
                                    <strong>Somos capaces.</strong> Hemos evitado la catástrofe total gracias a la cooperación global.
                                    El problema está "controlado" pero no resuelto.
                                </div>
                            </div>

                            <div className="conclusion-item">
                                <div className="ci-marker"><FaArrowUp /></div>
                                <div className="ci-text">
                                    <strong>El futuro es esperanzador.</strong> Si mantenemos el rumbo, las proyecciones indican una recuperación lenta.
                                    Tu acción individual hoy sigue siendo vital para no retroceder.
                                </div>
                            </div>

                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}
