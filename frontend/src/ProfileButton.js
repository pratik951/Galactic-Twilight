import React from 'react';

export default function ProfileButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open Profile"
      style={{
        position: 'absolute', top: 24, right: 24, zIndex: 1001,
        background: 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)',
        color: '#23243a', border: 'none', borderRadius: '50%',
        width: 48, height: 48, fontSize: 28, fontWeight: 700, boxShadow: '0 2px 8px #0004', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <span role="img" aria-label="Profile">👩‍🚀</span>
    </button>
  );
}
