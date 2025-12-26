export default function Footer() {
    return (
        <footer className="site-footer glass-panel">
            <div className="container">
                <p>Proyecto WISE · Plataforma ciudadana para la protección de la capa de ozono</p>
                <p className="copyright">&copy; {new Date().getFullYear()}</p>
            </div>
        </footer>
    );
}
