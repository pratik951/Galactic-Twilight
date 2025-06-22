import React from 'react';
import { useUser } from './UserContext';

export default function LogbookPanel() {
  const { logbook } = useUser();
  return (
    <div style={{ background: '#181a2a', borderRadius: 16, padding: 24, margin: '1rem 0', color: 'white', boxShadow: '0 2px 12px #0006' }}>
      <h3 style={{ color: '#ffd700' }}>Space Logbook</h3>
      {logbook.length === 0 && <p>Your journey log will appear here as you explore!</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {logbook.slice().reverse().map((entry, i) => (
          <li key={i} style={{ marginBottom: 8 }}>
            <span style={{ color: '#ffd700', marginRight: 8 }}>★</span>
            <span>{entry.action}</span>
            <span style={{ color: '#aaa', fontSize: 12, marginLeft: 8 }}>{new Date(entry.date).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
