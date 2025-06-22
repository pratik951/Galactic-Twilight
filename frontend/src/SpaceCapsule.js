import React, { useState, useEffect } from 'react';

function getCapsule() {
  return JSON.parse(localStorage.getItem('spaceCapsule') || '[]');
}
function setCapsule(items) {
  localStorage.setItem('spaceCapsule', JSON.stringify(items));
}

export function useSpaceCapsule() {
  const [capsule, setCapsuleState] = useState(getCapsule());
  useEffect(() => {
    setCapsule(capsule);
  }, [capsule]);
  const addItem = item => {
    setCapsuleState(prev => {
      const updated = [item, ...prev.filter(i => i.id !== item.id)];
      setCapsule(updated);
      return updated;
    });
  };
  const removeItem = id => {
    setCapsuleState(prev => {
      const updated = prev.filter(i => i.id !== id);
      setCapsule(updated);
      return updated;
    });
  };
  return { capsule, addItem, removeItem };
}

export default function SpaceCapsule({ open, onClose }) {
  const { capsule, removeItem } = useSpaceCapsule();
  if (!open) return null;
  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, background: 'rgba(0,0,0,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      tabIndex={-1}
    >
      <div style={{ position: 'absolute', right: 32, top: 32, background: '#23243a', color: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #000a', padding: 24, width: 400, maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto' }}>
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 8, right: 12, background: 'none', color: '#ffd700', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h3 style={{ color: '#ffd700', marginTop: 0 }}>🚀 My Space Capsule</h3>
        {capsule.length === 0 ? <div style={{ color: '#ccc' }}>No saved items yet.</div> : capsule.map(item => (
          <div key={item.id} style={{ background: '#333', borderRadius: 8, margin: '12px 0', padding: 12 }}>
            {item.type === 'apod' && (
              <>
                <img src={item.url} alt={item.title} style={{ width: '100%', borderRadius: 6, marginBottom: 6 }} />
                <div><b>{item.title}</b></div>
                <div style={{ fontSize: 12 }}>{item.date}</div>
                <div style={{ fontSize: 13, color: '#ffd700', marginTop: 6 }}>{item.caption}</div>
              </>
            )}
            {item.type === 'ai' && (
              <div style={{ fontStyle: 'italic', color: '#ffd700' }}>{item.caption}</div>
            )}
            <button onClick={() => removeItem(item.id)} style={{ background: 'salmon', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 10px', marginTop: 8, cursor: 'pointer' }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
