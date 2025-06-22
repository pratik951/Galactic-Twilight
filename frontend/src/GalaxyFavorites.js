import React, { useEffect, useRef } from 'react';

function getCapsule() {
  return JSON.parse(localStorage.getItem('spaceCapsule') || '[]');
}

export default function GalaxyFavorites({ open, onClose }) {
  const canvasRef = useRef();
  const [items, setItems] = React.useState([]);
  useEffect(() => {
    if (open) setItems(getCapsule());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = 600, h = 600;
    canvas.width = w; canvas.height = h;
    // Place stars/planets in a spiral galaxy pattern
    const n = items.length;
    const stars = items.map((item, i) => {
      const angle = i * 2 * Math.PI / Math.max(1, n);
      const radius = 120 + 180 * Math.sqrt(i / Math.max(1, n));
      return {
        x: w / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 18,
        y: h / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 18,
        r: 18 + Math.random() * 10,
        color: item.type === 'apod' ? '#ffd700' : '#7ecfff',
        idx: i
      };
    });
    function draw() {
      ctx.clearRect(0, 0, w, h);
      // Galaxy background
      const grad = ctx.createRadialGradient(w/2, h/2, 80, w/2, h/2, 300);
      grad.addColorStop(0, '#23243a');
      grad.addColorStop(1, '#111');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // Stars/planets
      for (let s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    draw();
  }, [items, open]);

  function handleCanvasClick(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const n = items.length;
    const stars = items.map((item, i) => {
      const angle = i * 2 * Math.PI / Math.max(1, n);
      const radius = 120 + 180 * Math.sqrt(i / Math.max(1, n));
      return {
        x: 300 + Math.cos(angle) * radius + (Math.random() - 0.5) * 18,
        y: 300 + Math.sin(angle) * radius + (Math.random() - 0.5) * 18,
        r: 18 + Math.random() * 10,
        idx: i
      };
    });
    for (let s of stars) {
      if ((x - s.x) ** 2 + (y - s.y) ** 2 < s.r ** 2) {
        setSelected(items[s.idx]);
        return;
      }
    }
  }
  const [selected, setSelected] = React.useState(null);

  if (!open) return null;
  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, background: 'rgba(0,0,0,0.8)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      tabIndex={-1}
    >
      <div style={{ position: 'absolute', left: 0, right: 0, top: 60, margin: '0 auto', background: '#23243a', color: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #000a', padding: 32, width: 700, maxWidth: '98vw', maxHeight: '80vh', overflowY: 'auto', textAlign: 'center' }}>
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 8, right: 12, background: 'none', color: '#ffd700', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h3 style={{ color: '#ffd700', marginTop: 0 }}>🌌 Galaxy of Favorites</h3>
        <canvas ref={canvasRef} width={600} height={600} style={{ width: '100%', maxWidth: 600, height: 400, borderRadius: 12, marginBottom: 16, background: '#111', cursor: 'pointer' }} onClick={handleCanvasClick} />
        {selected && (
          <div style={{ background: 'rgba(34,34,60,0.95)', borderRadius: 8, padding: 16, marginTop: 16, color: '#ffd700', boxShadow: '0 2px 8px #0008' }}>
            {selected.type === 'apod' && (
              <>
                <h4>{selected.title}</h4>
                <img src={selected.url} alt={selected.title} style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
                <div>{selected.explanation}</div>
              </>
            )}
            {selected.type === 'ai' && (
              <div style={{ fontStyle: 'italic', color: '#ffd700' }}>{selected.caption}</div>
            )}
          </div>
        )}
        {items.length === 0 && <div style={{ color: '#ccc', marginTop: 24 }}>No favorites yet. Save some APODs or AI stories to see them here!</div>}
      </div>
    </div>
  );
}
