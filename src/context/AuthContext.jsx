import { createContext, useContext, useState, useEffect } from 'react';
import API_URL from '../api';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token on load
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updatePoints = async (newPoints) => {
        // Optimistic update
        if (user) {
            const updatedUser = { ...user, points: newPoints };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Sync with backend
            try {
                const token = localStorage.getItem('token');
                await fetch(`${API_URL}/api/user/update-points`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ points: newPoints })
                });
            } catch (error) {
                console.error('Failed to sync points:', error);
            }
        }
    };

    const value = {
        user,
        login,
        logout,
        updatePoints,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
