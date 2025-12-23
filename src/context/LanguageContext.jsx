import { createContext, useState, useContext } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('es'); // Default to Spanish

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
