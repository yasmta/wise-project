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
                            <Link to="/challenges" className="btn-mini">
                                Ver Retos <FaArrowUp style={{ transform: 'rotate(45deg)' }} />
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
                            <h2>Resumen del Proyecto</h2>
                            <p className="lead-text">
                                Hemos analizado cuatro archivos de datos históricos relacionados con la capa de ozono:
                                concentración estratosférica de ozono, superficie del agujero de ozono, emisiones naturales
                                y totales de sustancias que lo destruyen, y consumo mundial de estos gases por países.
                            </p>
                            <p>
                                Nuestro objetivo ha sido entender cómo ha evolucionado el agujero de ozono en las últimas
                                décadas y qué relación tiene con las emisiones y el consumo de sustancias dañinas de
                                origen humano. A partir de estos datos esperábamos obtener conclusiones sobre si las
                                políticas internacionales de reducción de CFC y gases similares han tenido efecto real, si se
                                observa una tendencia de recuperación y hasta qué punto el problema está controlado o
                                sigue siendo preocupante de cara al futuro.
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
                                <h3>¿Qué es el agujero de ozono?</h3>
                                <p>
                                    Es una capa en la atmósfera, concretamente ubicada en la estratosfera que nos
                                    protege de los rayos UV (ultravioletas), ya que son perjudiciales para la salud humana,
                                    ecosistemas y hasta materiales. Hace de barrera natural absorbiendo gran parte de estos rayos.
                                </p>
                                <p>
                                    Esta capa se ha ido dañando por nuestra propia culpa, por diferentes tipos de gases que
                                    hemos ido liberando a la atmósfera y han dañado la capa de ozono, provocando desajustes
                                    y alteraciones en las reacciones químicas que se dan en ella. Esto ha dado lugar a zonas
                                    donde la concentración de ozono es muy baja, que son los “agujeros de ozono”.
                                </p>

                                <div className="pull-quote">
                                    <FaQuoteLeft className="quote-icon" />
                                    <p>
                                        Gracias al Protocolo de Montreal (1987), que prohibió la fabricación de muchos de
                                        los compuestos que la dañaban, la capa está en proceso de recuperación.
                                    </p>
                                </div>

                                <h3 className="mt-4">¿Qué gases lo provocan?</h3>
                                <p>
                                    Los principales responsables son las sustancias halogenadas antropogénicas como los CFC,
                                    halones, tetracloruro de carbono y metilcloroformo. Se usaban en sprays, refrigeración,
                                    espumas y disolventes.
                                </p>

                                <div className="details-accordion mt-4">
                                    <details>
                                        <summary>
                                            <div className="summary-trigger">
                                                <FaLightbulb className="mr-2" />
                                                <span>Profundizar: La Química de la Destrucción (Equilibrio NOx)</span>
                                                <FaChevronDown className="accordion-chevron" />
                                            </div>
                                        </summary>
                                        {/* Applied .chemical-deep-dive */}
                                        <div className="chemical-deep-dive">
                                            <p className="mb-2">
                                                En la estratosfera existe un equilibrio natural entre el ozono y los óxidos de nitrógeno (NOx).
                                                El NO y NO2 destruyen el O3, pero se forma ácido nítrico (HNO3) que mantiene a los NOx inactivos.
                                            </p>
                                            <p className="mb-2">
                                                El problema grave aparece con los compuestos clorados (CFCs). Son muy estables y llegan intactos a la estratosfera.
                                                Allí, la radiación solar rompe sus enlaces y libera <strong>Cloro</strong>.
                                            </p>
                                            <p>
                                                El cloro actúa como un catalizador: destruye el ozono transformándolo en oxígeno, pero no se consume en el proceso.
                                                <strong> Un solo átomo de cloro puede destruir miles de moléculas de ozono.</strong>
                                            </p>
                                        </div>
                                    </details>
                                </div>
                            </div>

                            <div className="story-grid-2 mt-6">
                                <div className="insight-box warning">
                                    <div className="box-icon"><FaExclamationTriangle /></div>
                                    <h4>Por qué es relevante</h4>
                                    <ul className="info-list-sm">
                                        <li>Daña directamente el ADN, aumentando cáncer de piel y cataratas.</li>
                                        <li>Daña el fitoplancton marino (base de la cadena alimentaria).</li>
                                        <li>Afecta cultivos y materiales.</li>
                                    </ul>
                                </div>
                                <div className="insight-box danger">
                                    <div className="box-icon"><FaShieldAlt /></div>
                                    <h4>Problema Global</h4>
                                    <p>
                                        Lo causan actividades humanas repartidas por todo el planeta y solo se puede resolver
                                        con acuerdos internacionales. Es un "caso de estudio" de éxito global.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. EXPLORACION: The Evidence */}
                    <section id="exploration" className="doc-section scroll-reveal">
                        <div className="section-title-wrapper">
                            <h2>La Evidencia</h2>
                            <p className="section-subtitle">Exploración inicial de los datos</p>
                        </div>

                        <div className="glass-card story-card">
                            <p>Para esta investigación, hemos analizado los siguientes archivos oficiales:</p>

                            <div className="file-cards-grid">
                                <div className="file-card">
                                    <div className="fc-icon"><FaChartLine /></div>
                                    <strong>Concentración</strong> <span className="text-sm">NASA 1979-2020</span>
                                    <p className="text-xs">Serie histórica mundial (mínima y media diaria).</p>
                                </div>
                                <div className="file-card">
                                    <div className="fc-icon"><FaCircle /></div>
                                    <strong>Superficie Agujero</strong> <span className="text-sm">NASA 1979-2020</span>
                                    <p className="text-xs">Serie histórica mundial (máxima y media anual).</p>
                                </div>
                                <div className="file-card">
                                    <div className="fc-icon"><FaIndustry /></div>
                                    <strong>Emisiones</strong> <span className="text-sm">1961-2014</span>
                                    <p className="text-xs">Naturales vs Totales de sustancias agotadoras.</p>
                                </div>
                                <div className="file-card">
                                    <div className="fc-icon"><FaGlobeAmericas /></div>
                                    <strong>Consumo</strong> <span className="text-sm">1989-2014</span>
                                    <p className="text-xs">Consumo por país y total mundial.</p>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-white/70">
                                <em>Datos adicionales considerados para mayor impacto: Rayos UV en superficie, casos mundiales de cataratas y cáncer de piel.</em>
                            </div>

                            <div className="details-accordion">
                                <details>
                                    <summary>
                                        <div className="summary-trigger">
                                            <FaTable className="mr-2" />
                                            <span>Ver descripción de los datos (Diccionario)</span>
                                            <FaChevronDown className="accordion-chevron" />
                                        </div>
                                    </summary>
                                    <div className="table-wrapper mt-4">
                                        <table className="data-table">
                                            <thead><tr><th>Columna</th><th>Descripción</th></tr></thead>
                                            <tbody>
                                                <tr><td>Minimum daily concentration</td><td>Concentración mínima diaria (U. Dobson). Grosor del escudo.</td></tr>
                                                <tr><td>Maximum ozone hole area</td><td>Superficie máxima anual del agujero (km²).</td></tr>
                                                <tr><td>Emisiones Naturales</td><td>Casi constantes (~165k t/año). Fondo base.</td></tr>
                                                <tr><td>Emisiones Antropogénicas</td><td>(Total - Naturales). La causa humana del problema.</td></tr>
                                                <tr><td>Consumo (Tonnes)</td><td>Uso de sustancias dañinas. Clave para evaluar políticas.</td></tr>
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
                            <h2>Análisis de Datos</h2>
                            <p className="section-subtitle">Estadísticas e Interpretación (1979-2020)</p>
                        </div>

                        <div className="glass-card story-card">

                            {/* Insight Statistics */}
                            <div className="big-stats-row">
                                <div className="b-stat">
                                    <span className="bs-val">102 UD</span>
                                    <span className="bs-label">Conc. Media 2020 (vs 225 en 1979)</span>
                                </div>
                                <div className="b-stat">
                                    <span className="bs-val">-99%</span>
                                    <span className="bs-label">Reducción Consumo (1989-2014)</span>
                                </div>
                                <div className="b-stat">
                                    <span className="bs-val">29.9M</span>
                                    <span className="bs-label">km² Máxima Extensión</span>
                                </div>
                            </div>

                            {/* Applied .stats-description-block */}
                            <div className="stats-description-block">
                                <h4><FaChartLine /> Estadísticas Descriptivas</h4>
                                <ul className="styled-list">
                                    <li>
                                        <strong>Concentración:</strong> El descenso es especialmente fuerte entre principios de los 80 y mediados de los 90.
                                        La concentración mínima diaria ha llegado a caer hasta las 73 UD.
                                    </li>
                                    <li>
                                        <strong>Emisiones:</strong> Las naturales son constantes (~165.000 t/año), mientras que las antropogénicas llegaron a multiplicar esa cifra,
                                        alcanzando 1.295.000 t/año en su pico.
                                    </li>
                                    <li>
                                        <strong>Consumo:</strong> Pasamos de 1.3 millones de toneladas en 1989 a solo 6.922 toneladas en 2014.
                                    </li>
                                </ul>

                                <div className="predictions-block">
                                    <h4>Predicciones (Tendencias)</h4>
                                    <p className="predictions-text">
                                        El consumo muestra una clara tendencia lineal descendente hacia cero. Sin embargo, la superficie del agujero
                                        muestra una estabilización reciente, no una recuperación inmediata. Esto confirma que el agujero responde con
                                        retraso a nuestras acciones.
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
                                        <h4>1. Concentración (El Deterioro)</h4>
                                        <p>Cae drásticamente de los 70 a los 90. Luego se mantiene baja con ligeras oscilaciones.</p>
                                    </div>
                                    <img src={chartOzone} alt="Concentración de Ozono" />
                                </div>

                                <div className="chart-wrapper">
                                    <div className="chart-header">
                                        <h4>2. Superficie (La Herida)</h4>
                                        <p>Crece rápido hasta mediados de los 2000. Tiende a estabilizarse, aunque con picos extremos.</p>
                                    </div>
                                    <img src={chartHole} alt="Superficie del Agujero" />
                                </div>

                                <div className="chart-wrapper">
                                    <div className="chart-header">
                                        <h4>3. Emisiones (La Causa)</h4>
                                        <p>Las naturales son planas. El problema aparece solo cuando añadimos las emisiones humanas masivas.</p>
                                    </div>
                                    <img src={chartEmissions} alt="Emisiones" />
                                </div>

                                <div className="chart-wrapper">
                                    <div className="chart-header">
                                        <h4>4. Consumo vs Impacto</h4>
                                        <p>Correlación débilmente negativa: al bajar el consumo, el agujero deja de crecer, pero no desaparece al instante.</p>
                                    </div>
                                    <img src={chartConsumption} alt="Consumo vs Superficie" />
                                </div>

                            </div>

                            <div className="interpretation-box">
                                <div className="ib-icon"><FaLightbulb /></div>
                                <div className="ib-content">
                                    <h4>Interpretación Clave</h4>
                                    <p>
                                        La atmósfera responde lento. Aunque hemos cerrado el grifo de los gases (consumo casi 0),
                                        el daño de los 80 tarda décadas en repararse. Sin embargo, la estabilización es real.
                                        Las políticas de reducción han sido efectivas para frenar el empeoramiento.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* 6. CONCLUSIONES: Moving Forward */}
                    <section id="conclusions" className="doc-section scroll-reveal">
                        <div className="glass-card story-card highlight-card">
                            <h2>Conclusiones Finales</h2>
                            <p className="mb-6 text-center text-lg">
                                El problema no es puntual, es resultado de décadas. Pero hemos aprendido lecciones vitales.
                            </p>
                            <br />

                            <div className="conclusion-item">
                                <div className="ci-marker"><FaCheckCircle /></div>
                                <div className="ci-text">
                                    <strong>Funcionó la cooperación.</strong> El Protocolo de Montreal demuestra que somos capaces de
                                    corregir errores globales cuando actuamos unidos.
                                </div>
                            </div>

                            <div className="conclusion-item">
                                <div className="ci-marker"><FaLeaf /></div>
                                <div className="ci-text">
                                    <strong>No es inmediato.</strong> "Apagar el grifo" no limpia el aire al instante.
                                    La inercia climática es de décadas.
                                </div>
                            </div>

                            <div className="conclusion-item">
                                <div className="ci-marker"><FaArrowUp /></div>
                                <div className="ci-text">
                                    <strong>El futuro.</strong> Si mantenemos las políticas, la mejora continuará. Si nos relajamos,
                                    podríamos retroceder. La vigilancia sigue siendo necesaria.
                                </div>
                            </div>

                            {/* Applied .reflections-box */}
                            <div className="reflections-box">
                                <h3>Reflexiones y Sorpresas</h3>
                                <p>
                                    Nos ha sorprendido la magnitud de los cambios: el desplome del consumo en tan pocos años y, a la vez,
                                    la resistencia del agujero a cerrarse rápido. Esto nos deja nuevas preguntas para el futuro:
                                </p>
                                <div className="future-questions-list">
                                    <div className="question-card">
                                        <FaCheckCircle className="question-icon" /> <span>¿Cuánto tiempo exacto tardará la capa en volver a niveles pre-1980?</span>
                                    </div>
                                    <div className="question-card">
                                        <FaExclamationTriangle className="question-icon" /> <span>¿Qué pasaría si se relajaran las restricciones hoy?</span>
                                    </div>
                                    <div className="question-card">
                                        <FaGlobeAmericas className="question-icon" /> <span>¿Cómo afecta la variabilidad natural año a año?</span>
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
