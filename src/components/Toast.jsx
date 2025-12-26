import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 3000); // Auto close after 3s

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300); // Match animation duration
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return <FaCheckCircle />;
            case 'error': return <FaExclamationCircle />;
            default: return <FaInfoCircle />;
        }
    };

    return (
        <div className="toast-container">
            <div className={`toast toast-${type} ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
                <div className="toast-icon">
                    {getIcon()}
                </div>
                <div className="toast-message">
                    {message}
                </div>
            </div>
        </div>
    );
};

export default Toast;
