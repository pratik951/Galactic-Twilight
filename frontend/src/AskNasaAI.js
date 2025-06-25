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

  return (
    <div
      onMouseDown={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        background: 'transparent'
      }}
    >
      <div
        ref={dialogRef}
        style={{
          position: 'fixed',
          right: 32,
          bottom: 100,
          width: 410,
          maxWidth: '95vw',
          minWidth: 260,
          height: 540,
          maxHeight: 540,
          minHeight: 320,
          background: 'linear-gradient(135deg, #23243a 80%, #2d2d4a 100%)',
          borderRadius: '22px',
          boxShadow: '0 4px 32px #000b',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 3001
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
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
          borderBottom: '1px solid #ffd70033'
        }}>
          <span>
            <span role="img" aria-label="Chatbot" style={{ fontSize: 26, marginRight: 8 }}>💬✨</span>
            NASA AI Chat
          </span>
          <button
            aria-label="Close"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#23243a',
              fontSize: 26,
              fontWeight: 700,
              cursor: 'pointer',
              marginLeft: 8,
              lineHeight: 1
            }}
          >×</button>
        </div>
        {/* Chat messages */}
        <div style={{
          flex: 1,
          padding: '22px 18px 0 18px',
          background: 'transparent',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                background: msg.from === 'user'
                  ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)'
                  : 'rgba(34,34,60,0.97)',
                color: msg.from === 'user' ? '#23243a' : '#ffd700',
                padding: '12px 18px',
                borderRadius: msg.from === 'user' ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
                maxWidth: '80%',
                fontSize: 16,
                boxShadow: '0 2px 8px #0005',
                wordBreak: 'break-word',
                border: msg.from === 'user' ? '1px solid #ffd70055' : '1px solid #ffd70022'
              }}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div style={{
              alignSelf: 'flex-start',
              background: 'rgba(34,34,60,0.97)',
              color: '#ffd700',
              padding: '12px 18px',
              borderRadius: '18px 18px 18px 6px',
              fontSize: 16,
              opacity: 0.85,
              maxWidth: '80%'
            }}>
              <span>
                <span role="img" aria-label="typing" style={{ marginRight: 6 }}>🤖</span>
                NASA AI is typing...
              </span>
            </div>
          )}
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          <div ref={chatEndRef} />
        </div>
        {/* Input area */}
        <form
          onSubmit={e => { e.preventDefault(); handleAsk(input.trim()); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 18px',
            background: '#20203a',
            borderBottomLeftRadius: 22,
            borderBottomRightRadius: 22,
            borderTop: '1px solid #ffd70033',
            gap: 10
          }}
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your question..."
            style={{
              flex: 1,
              borderRadius: 10,
              border: '1.5px solid #ffd70077',
              padding: '10px 14px',
              fontSize: 16,
              background: '#23243a',
              color: '#fff',
              outline: 'none',
              boxShadow: '0 1px 4px #0002'
            }}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              background: 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)',
              color: '#23243a',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 16,
              padding: '9px 22px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              boxShadow: '0 2px 8px #0003'
            }}
          >
            <span role="img" aria-label="Send" style={{ fontSize: 18, marginRight: 4 }}>📤</span>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AskNasaAI;


