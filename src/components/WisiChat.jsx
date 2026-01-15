import React, { useState, useRef, useEffect } from 'react';
import API_URL from '../api';
import { FaPaperPlane, FaSmile, FaTimes } from 'react-icons/fa';
import WisiAvatar from '../assets/images/wisi.png';
import './WisiChat.css';

const WisiChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'system', content: '¡Hola! Soy Wisi, tu experto en sostenibilidad. ¿En qué puedo ayudarte hoy? [badge:10]' }
    ]);
    const [input, setInput] = useState('');
    const [showBadges, setShowBadges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Badges 1-20
    const badges = Array.from({ length: 20 }, (_, i) => `/badges/${i + 1}.png`);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const apiMessages = messages.concat(userMessage).map(m => ({
                role: m.role === 'system' ? 'assistant' : m.role,
                content: m.content
            })).filter(m => m.role !== 'system' || m.content.startsWith('¡Hola!'));

            const response = await fetch(`${API_URL}/api/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: apiMessages }),
            });

            const data = await response.json();

            if (data.message) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message.content }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, tuve un problema al pensar. ¿Puedes repetirlo?' }]);
            }

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, no puedo conectar con el servidor en este momento.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const addBadge = (badgeSrc) => {
        const badgeId = badgeSrc.split('/').pop().split('.')[0];
        setInput(prev => prev + ` [badge:${badgeId}] `);
        setShowBadges(false);
    };

    // Helper to extract badges
    const extractBadges = (content) => {
        const matches = content.match(/\[badge:(\d+)\]/g);
        if (!matches) return [];
        return matches.map(m => m.match(/\d+/)[0]);
    };

    // Helper to remove badges from text
    const cleanText = (content) => {
        return content.replace(/\[badge:\d+\]/g, '').trim();
    };

    return (
        <div className="wisi-chat-container">
            {/* Chat Window - Always rendered but toggled via CSS for animation */}
            <div className={`wisi-window ${isOpen ? 'open' : ''}`}>
                <div className="wisi-header">
                    <h3>
                        <img src={WisiAvatar} alt="Wisi" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                        Chat con Wisi
                    </h3>
                    <button className="wisi-close" onClick={() => setIsOpen(false)}>
                        <FaTimes />
                    </button>
                </div>

                <div className="wisi-messages">
                    {messages.map((msg, idx) => {
                        const badges = extractBadges(msg.content);
                        const text = cleanText(msg.content);
                        return (
                            <div key={idx} className={`message ${msg.role === 'user' ? 'user' : 'system'}`}>
                                <div className="message-content">{text}</div>
                                {badges.length > 0 && (
                                    <div className="message-badges">
                                        {badges.map((id, i) => (
                                            <img key={i} src={`/badges/${id}.png`} alt="badge" className="emoji-badge" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {isLoading && (
                        <div className="message system">
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Badge Picker */}
                {showBadges && (
                    <div className="wisi-badge-picker">
                        {badges.map((badge, idx) => (
                            <div key={idx} className="badge-option" onClick={() => addBadge(badge)}>
                                <img src={badge} alt={`Badge ${idx + 1}`} />
                            </div>
                        ))}
                    </div>
                )}

                <div className="wisi-input-area">
                    <button className="wisi-btn" onClick={() => setShowBadges(!showBadges)}>
                        <FaSmile />
                    </button>
                    <input
                        type="text"
                        className="wisi-input"
                        placeholder="Escribe tu mensaje..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <button className="wisi-btn send" onClick={handleSend} disabled={isLoading || !input.trim()}>
                        <FaPaperPlane />
                    </button>
                </div>
            </div>

            {/* Trigger Button */}
            <div className="wisi-trigger" onClick={() => setIsOpen(!isOpen)} title="Habla con Wisi">
                <img src={WisiAvatar} alt="Wisi AI" className="wisi-avatar" />
            </div>
        </div>
    );
};

export default WisiChat;
