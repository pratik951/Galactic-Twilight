import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

// Simple planet component
function Planet({ position, color, size, name, onClick }) {
  return (
    <mesh position={position} onClick={() => onClick(name)}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

const PLANETS = [
  { name: 'Mercury', color: '#b1b1b1', size: 0.4, pos: [2, 0, 0] },
  { name: 'Venus', color: '#e6c97b', size: 0.7, pos: [4, 0, 0] },
  { name: 'Earth', color: '#3a7bd5', size: 0.75, pos: [6, 0, 0] },
  { name: 'Mars', color: '#c1440e', size: 0.6, pos: [8, 0, 0] },
  { name: 'Jupiter', color: '#e3c07b', size: 1.2, pos: [11, 0, 0] },
  { name: 'Saturn', color: '#e8d8b9', size: 1.1, pos: [14, 0, 0] },
  { name: 'Uranus', color: '#b5e3e3', size: 0.9, pos: [17, 0, 0] },
  { name: 'Neptune', color: '#4062bb', size: 0.9, pos: [20, 0, 0] },
];

export default function SolarSystemExplorer({ onPlanetSelect }) {
  const handlePlanetClick = (planet) => {
    if (onPlanetSelect) onPlanetSelect(planet);
  };

  return (
    <div style={{ height: '500px', width: '100%', background: 'black', borderRadius: '16px', margin: '2rem 0' }}>
      <Suspense fallback={<div style={{ color: 'white' }}>Loading 3D Solar System...</div>}>
        <Canvas camera={{ position: [0, 5, 25], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={2} />
          <Stars radius={100} depth={50} count={5000} factor={4} fade />
          {/* Sun */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial emissive={'#fff700'} color={'#fff700'} emissiveIntensity={1.5} />
          </mesh>
          {/* Planets */}
          {PLANETS.map((p) => (
            <Planet key={p.name} position={p.pos} color={p.color} size={p.size} name={p.name} onClick={handlePlanetClick} />
          ))}
          <OrbitControls enablePan={false} />
        </Canvas>
      </Suspense>
    </div>
  );
}
