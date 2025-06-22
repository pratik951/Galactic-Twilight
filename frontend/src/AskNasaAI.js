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
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const askAI = async () => {
    setLoading(true);
    setError(null);
    setAnswer('');
    try {
      const res = await axios.post('http://localhost:5000/api/ask-nasa', { question, context });
      setAnswer(res.data.answer);
    } catch (err) {
      setError('Failed to get answer from NASA AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}

export default AskNasaAI;
