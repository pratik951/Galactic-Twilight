import React from 'react';
import BadgesPanel from './BadgesPanel';
import LogbookPanel from './LogbookPanel';

export default function ProfileModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose} aria-modal="true" role="dialog">
      <div style={{ background: '#23243a', borderRadius: 18, boxShadow: '0 4px 24px #0008', padding: 32, minWidth: 350, maxWidth: 500, maxHeight: '80vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close Profile" style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#ffd700', fontSize: 28, cursor: 'pointer' }}>&times;</button>
        <h2 style={{ color: '#ffd700', textAlign: 'center', marginBottom: 16 }}>Your Space Journey</h2>
        <BadgesPanel />
        <LogbookPanel />
      </div>
    </div>
  );
}
