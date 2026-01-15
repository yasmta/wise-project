import { useState } from 'react';
import API_URL from '../api';
import { useAuth } from '../context/AuthContext';
import './Modal.css';

const COUNTRIES = [
    'Argentina', 'Bolivia', 'Chile', 'Colombia', 'Costa Rica', 'Cuba',
    'Dominican Republic', 'Ecuador', 'El Salvador', 'Equatorial Guinea',
    'Guatemala', 'Honduras', 'Mexico', 'Nicaragua', 'Panama', 'Paraguay',
    'Peru', 'Spain', 'Uruguay', 'Venezuela', 'Other'
];

export default function RegisterModal({ onClose, onSwitchToLogin }) {
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
            return setError('Passwords do not match');
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
                // Auto login or ask to login? Let's auto login for better UX
                // Wait... register endpoint doesn't return token currently. 
                // Let's just switch to login or notify success.
                // For simplicity, let's ask to login.
                alert('Registration successful! Please login.');
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
                <h2>Register</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input name="username" type="text" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Country</label>
                        <select name="country" onChange={handleChange} required defaultValue="">
                            <option value="" disabled>Select your country</option>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input name="confirmPassword" type="password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                    <p className="switch-auth">
                        Already have an account? <button type="button" className="link-btn" onClick={onSwitchToLogin}>Login</button>
                    </p>
                </form>
            </div>
        </div>
    );
}
