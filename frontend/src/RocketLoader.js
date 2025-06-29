import React from 'react';

export default function RocketLoader({ size = 40 }) {
  return (
    <div style={{ display: 'inline-block', textAlign: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1.2s linear infinite' }}>
        <g>
          <ellipse cx="24" cy="44" rx="6" ry="2.5" fill="#ffd700" opacity="0.5" />
          <path d="M24 4C28 10 36 24 24 44C12 24 20 10 24 4Z" fill="#fff" stroke="#ffd700" strokeWidth="2" />
          <circle cx="24" cy="16" r="3" fill="#ffd700" />
        </g>
      </svg>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
