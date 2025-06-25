import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
const MarsRoverGallery = React.lazy(() => import('./MarsRoverGallery'));
const EpicGallery = React.lazy(() => import('./EpicGallery'));
const NeoChart = React.lazy(() => import('./NeoChart'));
import AskNasaAI from './AskNasaAI';
import SpaceQuiz from './SpaceQuiz';
import SpaceStory from './SpaceStory';
import ApodTimeline from './ApodTimeline';
import Starfield from './Starfield';
import SolarSystemPage from './SolarSystemPage';
import { UserProvider } from './UserContext';
import AsteroidDefenseGame from './AsteroidDefenseGame';
import './i18n';
import { HighContrastProvider } from './HighContrastContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Base button style for Navbar
const buttonBase = {
  border: 'none',
  borderRadius: 8,
  padding: '8px 18px',
  cursor: 'pointer',
  background: '#23243a',
  color: '#ffd700',
  fontWeight: 500,
  fontSize: 15,
  transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
  boxShadow: '0 1px 4px #0003',
  outline: 'none',
  margin: 0
};

function Navbar({ page, setPage }) {
  return (
    <nav style={{ display: 'flex', gap: 12, marginBottom: 18, alignItems: 'center', justifyContent: 'center', background: 'rgba(30,32,50,0.85)', borderRadius: 10, padding: '6px 0', boxShadow: '0 1px 6px #0003' }}>
      <button onClick={() => setPage('apod')} style={{ ...buttonBase, fontWeight: page === 'apod' ? 'bold' : 'normal', background: page === 'apod' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'apod' ? '#23243a' : '#ffd700', fontSize: 15 }}>APOD</button>
      <button onClick={() => setPage('mars')} style={{ ...buttonBase, fontWeight: page === 'mars' ? 'bold' : 'normal', background: page === 'mars' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'mars' ? '#23243a' : '#ffd700', fontSize: 15 }}>Mars</button>
      <button onClick={() => setPage('epic')} style={{ ...buttonBase, fontWeight: page === 'epic' ? 'bold' : 'normal', background: page === 'epic' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'epic' ? '#23243a' : '#ffd700', fontSize: 15 }}>EPIC</button>
      <button onClick={() => setPage('neo')} style={{ ...buttonBase, fontWeight: page === 'neo' ? 'bold' : 'normal', background: page === 'neo' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'neo' ? '#23243a' : '#ffd700', fontSize: 15 }}>NEO</button>
      <button onClick={() => setPage('solar')} style={{ ...buttonBase, fontWeight: page === 'solar' ? 'bold' : 'normal', background: page === 'solar' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'solar' ? '#23243a' : '#ffd700', fontSize: 15 }}>Solar</button>
      <button onClick={() => setPage('asteroid')} style={{ ...buttonBase, fontWeight: page === 'asteroid' ? 'bold' : 'normal', background: page === 'asteroid' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'asteroid' ? '#23243a' : '#ffd700', fontSize: 15 }}>Asteroid Defense</button>
    </nav>
  );
}

// Try these color/background combinations for mainBg to see which works best with your animated space background:

// 1. Semi-transparent dark blue (good readability, default)
const mainBg1 = {
  minHeight: '100vh',
  background: 'rgba(30,32,50,0.75)',
  color: '#fff',
  fontFamily: 'Segoe UI, Arial, sans-serif',
  padding: 0,
  margin: 0,
  fontSize: 15,
  boxSizing: 'border-box',
  width: '100vw',
  overflowX: 'hidden'
};

// 2. More transparent for more GIF visibility (less readable)
const mainBg2 = {
  minHeight: '100vh',
  background: 'rgba(30,32,50,0.55)',
  color: '#fff',
  fontFamily: 'Segoe UI, Arial, sans-serif',
  padding: 0,
  margin: 0,
  fontSize: 15,
  boxSizing: 'border-box',
  width: '100vw',
  overflowX: 'hidden'
};

// 3. Slightly lighter blue with more opacity (good for lighter GIFs)
const mainBg3 = {
  minHeight: '100vh',
  background: 'rgba(44,62,80,0.85)',
  color: '#fff',
  fontFamily: 'Segoe UI, Arial, sans-serif',
  padding: 0,
  margin: 0,
  fontSize: 15,
  boxSizing: 'border-box',
  width: '100vw',
  overflowX: 'hidden'
};

// 4. Black with medium opacity (classic, works with most GIFs)
const mainBg4 = {
  minHeight: '100vh',
  background: 'rgba(0,0,0,0.7)',
  color: '#ffd700',
  fontFamily: 'Segoe UI, Arial, sans-serif',
  padding: 0,
  margin: 0,
  fontSize: 15,
  boxSizing: 'border-box',
  width: '100vw',
  overflowX: 'hidden'
};

// 5. Deep purple with high transparency (for a cosmic effect)
const mainBg5 = {
  minHeight: '100vh',
  background: 'rgba(40,0,60,0.65)',
  color: '#fff',
  fontFamily: 'Segoe UI, Arial, sans-serif',
  padding: 0,
  margin: 0,
  fontSize: 15,
  boxSizing: 'border-box',
  width: '100vw',
  overflowX: 'hidden'
};

// 6. No background (fully transparent, only text visible over GIF)
const mainBg6 = {
  minHeight: '100vh',
  background: 'transparent',
  color: '#fff',
  fontFamily: 'Segoe UI, Arial, sans-serif',
  padding: 0,
  margin: 0,
  fontSize: 15,
  boxSizing: 'border-box',
  width: '100vw',
  overflowX: 'hidden'
};

// ---
// To compare, render each in a separate section for visual comparison:
function App() {
  const [page, setPage] = useState('apod');
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [askNasaOpen, setAskNasaOpen] = useState(false);

  useEffect(() => {
    const fetchApod = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/apod`);
        setApod(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data from NASA backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchApod();
  }, []);

  function Spinner() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60 }}>
        <div style={{ border: '4px solid #eee', borderTop: '4px solid #8884d8', borderRadius: '50%', width: 32, height: 32, animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  function AICaption({ apod }) {
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateCaption = async () => {
      setLoading(true);
      setError(null);
      setCaption('');
      try {
        const res = await axios.post(`${API_URL}/api/ai-caption`, {
          title: apod.title,
          explanation: apod.explanation
        });
        setCaption(res.data.caption);
      } catch (err) {
        setError('Failed to generate AI caption.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{ marginTop: 16 }}>
        <button onClick={generateCaption} disabled={loading}>
          {loading ? 'Generating...' : 'Generate AI Caption'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {caption && <div style={{ marginTop: 12, fontStyle: 'italic', background: 'rgba(34,34,60,0.95)', color: '#ffd700', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #0008', maxWidth: 500, wordBreak: 'break-word' }}>{caption}
        </div>}
      </div>
    );
  }

  function FloatingButton({ label, children, ...props }) {
    const [hover, setHover] = useState(false);
    return (
      <div
        style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}
        {hover && (
          <div
            style={{
              position: 'absolute',
              left: 70,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(30,32,50,0.97)',
              color: '#ffd700',
              padding: '6px 14px',
              borderRadius: 8,
              whiteSpace: 'nowrap',
              fontWeight: 600,
              fontSize: 15,
              boxShadow: '0 2px 8px #0008',
              zIndex: 2000,
              pointerEvents: 'none'
            }}
          >
            {label}
          </div>
        )}
      </div>
    );
  }

  return (
    <HighContrastProvider>
      <UserProvider>
        {/* Global space background for the entire webpage */}
        <style>{`
          body {
            background: url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1500&q=80') no-repeat center center fixed;
            background-size: cover;
            min-height: 100vh;
          }
          /* Optional: dark overlay for readability */
          #space-overlay-bg {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(20, 10, 40, 0.7);
            z-index: 0;
            pointer-events: none;
          }
        `}</style>
        <div id="space-overlay-bg"></div>
        {/* Extra space visuals: planet SVG and shooting star */}
        <svg
          style={{
            position: 'fixed',
            left: 0,
            bottom: 0,
            width: 260,
            height: 260,
            zIndex: 0,
            opacity: 0.45,
            pointerEvents: 'none',
          }}
          viewBox="0 0 260 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="130" cy="180" rx="110" ry="60" fill="#6a5acd" />
          <ellipse cx="130" cy="200" rx="90" ry="40" fill="#483d8b" />
          <ellipse cx="130" cy="220" rx="70" ry="20" fill="#22223b" />
          <circle cx="90" cy="140" r="18" fill="#fff59d" opacity="0.5" />
          <circle cx="170" cy="160" r="10" fill="#ffd700" opacity="0.7" />
        </svg>
        <div className="shooting-star" style={{ position: 'fixed', top: '18%', left: '10%', zIndex: 0, pointerEvents: 'none' }}></div>
        <style>{`
          .shooting-star {
            width: 120px;
            height: 2px;
            background: linear-gradient(90deg, #fff 0%, #ffd700 60%, transparent 100%);
            border-radius: 2px;
            opacity: 0.7;
            animation: shooting 2.5s linear infinite;
          }
          @keyframes shooting {
            0% { transform: translateX(0) scaleX(0.2); opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateX(600px) scaleX(1); opacity: 0; }
          }
        `}</style>
        {/* Animated starfield background */}
        <Starfield />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, position: 'relative', zIndex: 1 }}>
          <div style={mainBg5}>
            <div style={{
              padding: 16,
              fontWeight: 700,
              fontSize: 28,
              color: '#ffd700',
              textAlign: 'center',
              textShadow: '0 0 16px #ffd700, 0 0 32px #8e44ad, 0 0 4px #fff',
              letterSpacing: 2,
              marginBottom: 8,
              filter: 'drop-shadow(0 0 8px #fff8)'
            }}>
              <span role="img" aria-label="galaxy">🌌</span> Galactic Twilight <span role="img" aria-label="star">✨</span>
            </div>
            <div style={{
              maxWidth: 900,
              width: '100%',
              margin: '0 auto',
              padding: 24,
              position: 'relative',
              zIndex: 2,
              marginTop: '-24px',
              // Optional: add a faint nebula/planet SVG background overlay
              backgroundImage: `url('https://cdn.jsdelivr.net/gh/astronautweb/space-images/nebula-purple.png')`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right bottom',
              backgroundSize: '320px',
              minHeight: 600
            }}>
              <Navbar page={page} setPage={setPage} />
              {page === 'apod' && (
                <Card>
                  <h1 style={{ color: '#ffd700', marginBottom: 8 }}>NASA Astronomy Picture of the Day</h1>
                  {loading && <Spinner />}
                  {error && <p style={{ color: 'salmon' }}>{error}</p>}
                  {apod && (
                    <div style={{ maxWidth: 600 }}>
                      <h2 style={{ color: '#fff' }}>{apod.title}</h2>
                      <img src={apod.url} alt={apod.title} style={{ width: '100%', borderRadius: 8, boxShadow: '0 2px 8px #0006' }} />
                      <p style={{ color: '#e0e0e0' }}>{apod.explanation}</p>
                      <p><b>Date:</b> {apod.date}</p>
                      <AICaption apod={apod} />
                    </div>
                  )}
                </Card>
              )}
              {page === 'mars' && (
                <Card style={{ background: '#1a1b2e' }}>
                  <Suspense fallback={<Spinner />}>
                    <MarsRoverGallery />
                  </Suspense>
                </Card>
              )}
              {page === 'epic' && (
                <Card>
                  <Suspense fallback={<Spinner />}>
                    <EpicGallery />
                  </Suspense>
                </Card>
              )}
              {page === 'neo' && (
                <Card>
                  <Suspense fallback={<Spinner />}>
                    <NeoChart />
                  </Suspense>
                </Card>
              )}
              {page === 'solar' && (
                <Card style={{ background: '#0a0a1a' }}>
                  <SolarSystemPage />
                </Card>
              )}
              {page === 'asteroid' && (
                <Card><AsteroidDefenseGame /></Card>
              )}
            </div>
          </div>
        </div>
        {/* Ask NASA AI floating button at bottom right */}
        <div style={{
          position: 'fixed',
          right: 32,
          bottom: 32,
          zIndex: 1200
        }}>
          <button
            aria-label="Ask NASA AI"
            onClick={() => setAskNasaOpen(true)}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffd700 60%, #ffb347 100%)',
              color: '#23243a',
              border: 'none',
              boxShadow: '0 4px 18px #0008',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              cursor: 'pointer',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
          >
            <span role="img" aria-label="Chatbot" style={{ fontSize: 30 }}>💬</span>
          </button>
        </div>
        {/* AskNasaAI chat panel at bottom right */}
        {askNasaOpen && (
          <AskNasaAI
            context={{ apod, page }}
            open={askNasaOpen}
            onClose={() => setAskNasaOpen(false)}
          />
        )}
        {/* Floating action buttons as circular icons like NASA AI */}
        <div style={{
          position: 'fixed',
          left: 32,
          bottom: 32,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 18 // slightly more gap for circles
        }}>
          <button
            aria-label="Open Space Quiz"
            onClick={() => setQuizOpen(true)}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffd700 60%, #ffb347 100%)',
              color: '#23243a',
              border: 'none',
              boxShadow: '0 4px 18px #0008',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              cursor: 'pointer',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
            title="Space Quiz"
          >
            <span role="img" aria-label="Space Quiz">🧑‍🚀</span>
          </button>
          <button
            aria-label="Open Space Story Mode"
            onClick={() => setStoryOpen(true)}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffd700 60%, #ffb347 100%)',
              color: '#23243a',
              border: 'none',
              boxShadow: '0 4px 18px #0008',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              cursor: 'pointer',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
            title="Space Story Mode"
          >
            <span role="img" aria-label="Space Story Mode">🌌</span>
          </button>
          <button
            aria-label="Open APOD Timeline"
            onClick={() => setTimelineOpen(true)}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffd700 60%, #ffb347 100%)',
              color: '#23243a',
              border: 'none',
              boxShadow: '0 4px 18px #0008',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              cursor: 'pointer',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
            title="APOD Timeline"
          >
            <span role="img" aria-label="APOD Timeline">🕑</span>
          </button>
        </div>
        <SpaceQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />
        {apod && <SpaceStory apod={apod} open={storyOpen} onClose={() => setStoryOpen(false)} />}
        <ApodTimeline open={timelineOpen} onClose={() => setTimelineOpen(false)} />
      </UserProvider>
    </HighContrastProvider>
  );
}

export default App;

// Make sure Card is defined before App
function Card({ children, style }) {
  return (
    <div style={{
      background: 'linear-gradient(120deg, #23243a 80%, #2d2d4a 100%)',
      borderRadius: 14,
      boxShadow: '0 2px 12px #0006',
      padding: 18,
      margin: '0 auto',
      marginBottom: 18,
      border: '1px solid #ffd70033',
      transition: 'box-shadow 0.3s, transform 0.3s',
      ...style
    }}>
      {children}
    </div>
  );
}


