import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AskNasaAI({ context, open = true, onClose }) {
  const dialogRef = useRef();
  const [messages, setMessages] = useState([
    { from: 'bot', text: "👋 Hi! I'm NASA AI. Ask me anything about space, NASA, or astronomy!" }
  ]);
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-scroll to bottom on new message
  const chatEndRef = useRef();
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!open) return null;

  // Updated the backdrop click handler to close the chat window when clicking anywhere on the page
  function handleBackdropClick(e) {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      onClose && onClose();
    }
  }

  const handleAsk = async (question) => {
    setError(null);
    setLoading(true);
    setAnswer('');
    try {
      // Make sure this endpoint matches your backend route exactly!
      // For example, if your backend route is /api/ask_nasa_ai, use that.
      const res = await axios.post(`${API_URL}/api/ask-nasa-ai`, { question, ...context });
      setAnswer(res.data.answer);
    } catch (err) {
      let msg = 'Failed to get answer from NASA AI';
      if (err.response && err.response.data && err.response.data.error) {
        msg += ': ' + err.response.data.error;
      } else if (err.message) {
        msg += ': ' + err.message;
      }
      setError(msg);
      console.error('AskNasaAI error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Updated styles for the NASA AI Bot chat window
  const chatWindowStyle = {
    position: 'fixed',
    right: 32,
    bottom: 100,
    width: 410,
    maxWidth: '95vw',
    minWidth: 260,
    height: 540,
    maxHeight: 540,
    minHeight: 320,
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)', // Space-themed gradient
    borderRadius: '22px',
    boxShadow: '0 4px 32px rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 3001,
    overflow: 'hidden',
  };

  const chatHeaderStyle = {
    background: 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)',
    color: '#23243a',
    padding: '20px 28px',
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
  };

  const chatMessageStyle = {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    fontFamily: 'Arial, sans-serif',
    color: '#fff',
  };

  const chatInputStyle = {
    padding: '12px 16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    background: '#16213e',
    color: '#fff',
    fontSize: 16,
    outline: 'none',
    border: 'none',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  };

  // Applying the styles in the component
  return (
    <div
      onMouseDown={handleBackdropClick} // Close on clicking anywhere outside the chat window
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        ref={dialogRef}
        style={chatWindowStyle}
        onMouseDown={(e) => e.stopPropagation()} // Prevent closing when clicking inside the chat window
      >
        {/* Header */}
        <div style={chatHeaderStyle}>
          <span>
            <span
              role="img"
              aria-label="Chatbot"
              style={{ fontSize: 26, marginRight: 8 }}
            >
              💬✨
            </span>
            NASA AI Bot
          </span>
          <button
            onClick={onClose} // Close on clicking the close button
            style={{
              background: 'none',
              border: 'none',
              color: '#23243a',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            ✖
          </button>
        </div>

        {/* Messages */}
        <div style={chatMessageStyle}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: 12,
                textAlign: msg.from === 'bot' ? 'left' : 'right',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: 12,
                  background: msg.from === 'bot' ? '#1a1a2e' : '#ffd700',
                  color: msg.from === 'bot' ? '#fff' : '#23243a',
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAsk(input);
          }}
          placeholder="Ask me anything..."
          style={chatInputStyle}
        />
      </div>
    </div>
  );
}

export default AskNasaAI;
