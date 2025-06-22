import React, { useState } from 'react';
import axios from 'axios';

export default function SpaceStory({ apod, open, onClose }) {
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animIdx, setAnimIdx] = useState(0);

  const generateStory = async () => {
    setLoading(true);
    setError(null);
    setStory('');
    setAnimIdx(0);
    try {
      const res = await axios.post('http://localhost:5000/api/ai-caption', {
        title: apod.title,
        explanation: apod.explanation + '\nWrite a short, poetic story or poem about this image.'
      });
      setStory(res.data.caption);
      setAnimIdx(1); // Start animation
    } catch (err) {
      setError('Failed to generate story.');
    } finally {
      setLoading(false);
    }
  };

  // Typewriter animation
  React.useEffect(() => {
    if (story && animIdx < story.length) {
      const t = setTimeout(() => setAnimIdx(i => i + 1), 28);
      return () => clearTimeout(t);
    }
  }, [story, animIdx]);

  if (!open) return null;
  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, background: 'rgba(0,0,0,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      tabIndex={-1}
    >
      <div style={{ position: 'absolute', left: 0, right: 0, top: 60, margin: '0 auto', background: '#23243a', color: '#ffd700', borderRadius: 16, boxShadow: '0 2px 16px #000a', padding: 32, width: 500, maxWidth: '95vw', maxHeight: '80vh', overflowY: 'auto', textAlign: 'center' }}>
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 8, right: 12, background: 'none', color: '#ffd700', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h3 style={{ color: '#ffd700', marginTop: 0 }}>🌌 Space Story Mode</h3>
        <img src={apod.url} alt={apod.title} style={{ width: '100%', borderRadius: 8, marginBottom: 16, boxShadow: '0 2px 8px #0008' }} />
        <div style={{ minHeight: 80, fontFamily: 'serif', fontSize: 18, margin: '16px 0', color: '#ffd700', background: 'rgba(34,34,60,0.95)', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px #0008', whiteSpace: 'pre-line', letterSpacing: 0.5 }}>
          {story ? story.slice(0, animIdx) : ''}
        </div>
        <button onClick={generateStory} disabled={loading} style={{ background: '#ffd700', color: '#23243a', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, marginTop: 8 }}>
          {loading ? 'Generating...' : 'Generate Space Story'}
        </button>
        {error && <div style={{ color: 'salmon', marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
}
