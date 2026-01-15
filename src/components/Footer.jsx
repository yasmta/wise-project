import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="site-footer glass-panel">
            <div className="container">
                <p>{t('footer_text')}</p>
                <p className="copyright">&copy; {new Date().getFullYear()}</p>
            </div>
        </footer>
    );
}
