export default function Footer() {
    return (
        <footer style={{
            padding: '2rem 0',
            textAlign: 'center',
            marginTop: 'auto',
            borderTop: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)'
        }}>
            <div className="container">
                <p>Proyecto WISE · Plataforma ciudadana para la protección de la capa de ozono</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>&copy; {new Date().getFullYear()}</p>
            </div>
        </footer>
    );
}
