import { useState } from 'react';
import API_URL from '../api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Modal.css';

const COUNTRIES = [
    'Argentina', 'Bolivia', 'Chile', 'Colombia', 'Costa Rica', 'Cuba',
    'Dominican Republic', 'Ecuador', 'El Salvador', 'Equatorial Guinea',
    'Guatemala', 'Honduras', 'Mexico', 'Nicaragua', 'Panama', 'Paraguay',
    'Peru', 'Spain', 'Uruguay', 'Venezuela', 'Other'
];

export default function RegisterModal({ onClose, onSwitchToLogin }) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth(); // Consider auto-login after register

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError(t('error_passwords_match'));
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    country: formData.country
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(t('register_success_alert'));
                onSwitchToLogin();
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2>{t('modal_register_title')}</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('label_username')}</label>
                        <input name="username" type="text" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>{t('label_email')}</label>
                        <input name="email" type="email" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>{t('label_country')}</label>
                        <select name="country" onChange={handleChange} required defaultValue="">
                            <option value="" disabled>{t('placeholder_select_country')}</option>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('label_password')}</label>
                        <input name="password" type="password" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>{t('label_confirm_password')}</label>
                        <input name="confirmPassword" type="password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">{t('btn_register')}</button>
                    <p className="switch-auth">
                        {t('text_has_account')} <button type="button" className="link-btn" onClick={onSwitchToLogin}>{t('link_login')}</button>
                    </p>
                </form>
            </div>
        </div>
    );
}
