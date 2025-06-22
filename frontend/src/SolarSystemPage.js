import React, { useState } from 'react';
import SolarSystemExplorer from './SolarSystemExplorer';

const PLANET_FACTS = {
  Mercury: 'Mercury is the closest planet to the Sun and has no atmosphere.',
  Venus: 'Venus is the hottest planet in our solar system.',
  Earth: 'Earth is the only planet known to support life.',
  Mars: 'Mars is known as the Red Planet.',
  Jupiter: 'Jupiter is the largest planet in our solar system.',
  Saturn: 'Saturn is famous for its beautiful rings.',
  Uranus: 'Uranus rotates on its side and has faint rings.',
  Neptune: 'Neptune is the farthest planet from the Sun.',
};

export default function SolarSystemPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
      <h2>3D Solar System Explorer</h2>
      <p>Click a planet to learn more!</p>
      <SolarSystemExplorer onPlanetSelect={setSelected} />
      {selected && (
        <div style={{ marginTop: '1rem', background: '#222', borderRadius: '12px', padding: '1rem', display: 'inline-block' }}>
          <h3>{selected}</h3>
          <p>{PLANET_FACTS[selected]}</p>
          <button onClick={() => setSelected(null)} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#3a7bd5', color: 'white', cursor: 'pointer' }}>Close</button>
        </div>
      )}
    </div>
  );
}
