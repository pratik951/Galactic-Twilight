import React from 'react';
import { useUser } from './UserContext';

export default function BadgesPanel() {
  const { badges, BADGE_DEFS } = useUser();
  return (
    <div style={{ background: '#181a2a', borderRadius: 16, padding: 24, margin: '1rem 0', color: 'white', boxShadow: '0 2px 12px #0006' }}>
      <h3 style={{ color: '#ffd700' }}>Your Badges</h3>
      {badges.length === 0 && <p>No badges earned yet. Explore and achieve!</p>}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 12 }}>
        {BADGE_DEFS.map(b => (
          <div key={b.id} style={{ opacity: badges.includes(b.id) ? 1 : 0.3, textAlign: 'center', minWidth: 90 }}>
            <div style={{ fontSize: 36 }}>{b.icon}</div>
            <div style={{ fontWeight: 700 }}>{b.name}</div>
            <div style={{ fontSize: 12, color: '#ccc' }}>{b.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
