import React, { useState } from 'react';
import axios from 'axios';

function getPastDates(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

export default function ApodTimeline({ open, onClose }) {
  const [apods, setApods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const fetchApods = async () => {
    setLoading(true);
    setError(null);
    try {
      const dates = getPastDates(10);
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const res = await axios.get(`${apiUrl}/api/apod`, {
        params: { start_date: dates[dates.length - 1], end_date: dates[0] }
      });
      setApods(Array.isArray(res.data) ? res.data.reverse() : [res.data]);
    } catch (err) {
      setError('Failed to fetch APOD timeline.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { if (open) fetchApods(); }, [open]);

  if (!open) return null;
  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, background: 'rgba(0,0,0,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      tabIndex={-1}
    >
      <div style={{ position: 'absolute', left: 0, right: 0, top: 60, margin: '0 auto', background: '#23243a', color: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #000a', padding: 32, width: 700, maxWidth: '98vw', maxHeight: '80vh', overflowY: 'auto' }}>
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 8, right: 12, background: 'none', color: '#ffd700', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h3 style={{ color: '#ffd700', marginTop: 0 }}>🕑 APOD Timeline</h3>
        {loading && (
          <div style={{ textAlign: 'center', margin: '1rem' }}>
            <RocketLoader size={36} />
          </div>
        )}
        {error && <div style={{ color: 'salmon' }}>{error}</div>}
        <div style={{ display: 'flex', overflowX: 'auto', gap: 16, margin: '24px 0' }}>
          {apods.map((apod, idx) => (
            <div key={apod.date} onClick={() => setSelected(apod)} style={{ minWidth: 120, cursor: 'pointer', border: selected?.date === apod.date ? '2px solid #ffd700' : '2px solid transparent', borderRadius: 8, background: '#333', padding: 8, textAlign: 'center', color: '#fff' }}>
              <img src={apod.url} alt={apod.title} style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 6, marginBottom: 4 }} />
              <div style={{ fontSize: 12 }}>{apod.date}</div>
            </div>
          ))}
        </div>
        {selected && (
          <div style={{ background: 'rgba(34,34,60,0.95)', borderRadius: 8, padding: 16, marginTop: 16, color: '#ffd700', boxShadow: '0 2px 8px #0008' }}>
            <h4>{selected.title}</h4>
            <img src={selected.url} alt={selected.title} style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
            <div>{selected.explanation}</div>
          </div>
        )}
      </div>
    </div>
  );
}
