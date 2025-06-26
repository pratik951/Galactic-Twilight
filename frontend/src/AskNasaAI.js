<<<<<<< HEAD
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AskNasaAI({ context, open = true, onClose }) {
  const dialogRef = useRef();
  const [messages, setMessages] = useState([
    { from: 'bot', text: "👋 Hi! I'm NASA AI. Ask me anything about space, NASA, or astronomy!" }
  ]);
  const [input, setInput] = useState('');
=======
import React, { useState } from 'react';
import axios from 'axios';

const SUGGESTIONS = [
  "What is special about today's APOD?",
  "Tell me about the closest asteroid this week.",
  "What does the latest EPIC image show?",
  "What did Curiosity see on Mars today?"
];

function AskNasaAI({ context }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
>>>>>>> 213db378c9fbf41e664e26138b161ec1992d3fbc
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

<<<<<<< HEAD
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
=======
  const askAI = async () => {
    setLoading(true);
    setError(null);
    setAnswer('');
    try {
      const res = await axios.post('http://localhost:5000/api/ask-nasa', { question, context });
      setAnswer(res.data.answer);
    } catch (err) {
      setError('Failed to get answer from NASA AI.');
>>>>>>> 213db378c9fbf41e664e26138b161ec1992d3fbc
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <>
      <button
        aria-label="Ask NASA AI"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', right: 32, bottom: 32, zIndex: 1000,
          background: '#ffd700', color: '#23243a', border: 'none', borderRadius: '50%', width: 60, height: 60, fontSize: 32, fontWeight: 700, boxShadow: '0 2px 12px #0006', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
        }}>
        <span role="img" aria-label="message" style={{ fontSize: 32 }}>💬</span>
      </button>
      {open && (
        <div style={{ position: 'fixed', right: 32, bottom: 110, zIndex: 1001, background: '#23243a', color: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #000a', padding: 24, width: 340, maxWidth: '90vw' }}>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: -32, display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: '#ffd700', color: '#23243a', borderRadius: 12, padding: '6px 24px', fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px #0004', letterSpacing: 1 }}>ASKNASA AI</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close" style={{ position: 'absolute', top: 8, right: 12, background: 'none', color: '#ffd700', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
          <h3 style={{ color: '#ffd700', marginTop: 24 }}>Ask NASA AI</h3>
          <div style={{ marginBottom: 8 }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => setQuestion(s)} style={{ background: '#333', color: '#ffd700', border: 'none', borderRadius: 6, margin: 2, padding: '2px 8px', cursor: 'pointer', fontSize: 12 }}>{s}</button>
            ))}
          </div>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask anything about NASA data..."
            rows={2}
            style={{ width: '100%', borderRadius: 6, border: '1px solid #888', padding: 8, marginBottom: 8, resize: 'vertical', fontFamily: 'inherit' }}
          />
          <button onClick={askAI} disabled={loading || !question.trim()} style={{ background: '#ffd700', color: '#23243a', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, marginBottom: 8 }}>
            {loading ? 'Thinking...' : 'Ask'}
          </button>
          {error && <div style={{ color: 'salmon', marginBottom: 8 }}>{error}</div>}
          {answer && <div style={{ background: 'rgba(34,34,60,0.95)', color: '#ffd700', padding: 12, borderRadius: 8, marginTop: 8, fontStyle: 'italic', boxShadow: '0 2px 8px #0008' }}>{answer}</div>}
        </div>
      )}
    </>
>>>>>>> 213db378c9fbf41e664e26138b161ec1992d3fbc
  );
}

export default AskNasaAI;
<<<<<<< HEAD


=======
>>>>>>> 213db378c9fbf41e664e26138b161ec1992d3fbc
