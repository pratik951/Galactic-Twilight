import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
const MarsRoverGallery = React.lazy(() => import('./MarsRoverGallery'));
const EpicGallery = React.lazy(() => import('./EpicGallery'));
const NeoChart = React.lazy(() => import('./NeoChart'));
import AskNasaAI from './AskNasaAI';
import SpaceCapsule, { useSpaceCapsule } from './SpaceCapsule';
import SpaceQuiz from './SpaceQuiz';
import SpaceStory from './SpaceStory';
import ApodTimeline from './ApodTimeline';
import Starfield from './Starfield';
import SolarSystemPage from './SolarSystemPage';
import { UserProvider } from './UserContext';
import ProfileModal from './ProfileModal';
import ProfileButton from './ProfileButton';
import AsteroidDefenseGame from './AsteroidDefenseGame';
import './i18n';
import { HighContrastProvider, useHighContrast } from './HighContrastContext';

function HighContrastToggle() {
  const { highContrast, setHighContrast } = useHighContrast();
  return (
    <button
      aria-label={'Toggle high contrast mode'}
      style={{ marginLeft: 16, borderRadius: 6, padding: '2px 8px', fontSize: 15 }}
      onClick={() => setHighContrast(h => !h)}
    >
      {highContrast ? '🌑 High Contrast: ON' : '🌕 High Contrast: OFF'}
    </button>
  );
}

function Navbar({ page, setPage }) {
  return (
    <nav style={{ display: 'flex', gap: 12, marginBottom: 18, alignItems: 'center', justifyContent: 'center', background: 'rgba(30,32,50,0.85)', borderRadius: 10, padding: '6px 0', boxShadow: '0 1px 6px #0003' }}>
      <button onClick={() => setPage('apod')} style={{ ...buttonBase, fontWeight: page === 'apod' ? 'bold' : 'normal', background: page === 'apod' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'apod' ? '#23243a' : '#ffd700', fontSize: 15 }}>APOD</button>
      <button onClick={() => setPage('mars')} style={{ ...buttonBase, fontWeight: page === 'mars' ? 'bold' : 'normal', background: page === 'mars' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'mars' ? '#23243a' : '#ffd700', fontSize: 15 }}>Mars</button>
      <button onClick={() => setPage('epic')} style={{ ...buttonBase, fontWeight: page === 'epic' ? 'bold' : 'normal', background: page === 'epic' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'epic' ? '#23243a' : '#ffd700', fontSize: 15 }}>EPIC</button>
      <button onClick={() => setPage('neo')} style={{ ...buttonBase, fontWeight: page === 'neo' ? 'bold' : 'normal', background: page === 'neo' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'neo' ? '#23243a' : '#ffd700', fontSize: 15 }}>NEO</button>
      <button onClick={() => setPage('solar')} style={{ ...buttonBase, fontWeight: page === 'solar' ? 'bold' : 'normal', background: page === 'solar' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'solar' ? '#23243a' : '#ffd700', fontSize: 15 }}>Solar</button>
      <button onClick={() => setPage('asteroid')} style={{ ...buttonBase, fontWeight: page === 'asteroid' ? 'bold' : 'normal', background: page === 'asteroid' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'asteroid' ? '#23243a' : '#ffd700', fontSize: 15 }}>Asteroid Defense</button>
      <HighContrastToggle />
    </nav>
  );
}

const mainBg = {
  minHeight: '100vh',
  background: 'linear-gradient(120deg, #232526 0%, #414345 100%)',
  color: '#fff',
  fontFamily: 'Segoe UI, Arial, sans-serif',
  padding: 0,
  margin: 0,
  fontSize: 15,
};

const buttonBase = {
  background: 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)',
  color: '#23243a',
  border: 'none',
  borderRadius: 8,
  fontWeight: 700,
  boxShadow: '0 2px 8px #0004',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  outline: 'none',
  fontSize: 15,
  padding: '6px 16px',
  minWidth: 0,
  minHeight: 0,
};

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

function App() {
  const [page, setPage] = useState('apod');
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [capsuleOpen, setCapsuleOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { addItem: addToCapsule } = useSpaceCapsule();
  // Removed t and translation usage

  useEffect(() => {
    const fetchApod = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/apod');
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

  function AICaption({ apod, addToCapsule }) {
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateCaption = async () => {
      setLoading(true);
      setError(null);
      setCaption('');
      try {
        const res = await axios.post('http://localhost:5000/api/ai-caption', {
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
          {addToCapsule && <button onClick={() => addToCapsule({ id: apod.date + '-ai', type: 'ai', caption })} style={{ marginLeft: 12, ...buttonBase, padding: '2px 10px' }}>Save to Capsule</button>}
        </div>}
      </div>
    );
  }

  return (
    <HighContrastProvider>
      <UserProvider>
        <div style={mainBg}>
          <Starfield />
          <ProfileButton onClick={() => setProfileOpen(true)} />
          <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
          <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, position: 'relative', zIndex: 1 }}>
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
                    <AICaption apod={apod} addToCapsule={addToCapsule} />
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
          <AskNasaAI context={{ apod, page }} />
          <button
            aria-label="Open Space Capsule"
            onClick={() => setCapsuleOpen(true)}
            style={{
              position: 'fixed', left: 32, bottom: 32, zIndex: 1000,
              ...buttonBase, width: 60, height: 60, fontSize: 28, fontWeight: 700, boxShadow: '0 2px 12px #0006'
            }}>
            🚀
          </button>
          <SpaceCapsule open={capsuleOpen} onClose={() => setCapsuleOpen(false)} />
          <button
            aria-label="Open Space Quiz"
            onClick={() => setQuizOpen(true)}
            style={{
              position: 'fixed', left: 32, bottom: 110, zIndex: 1000,
              ...buttonBase, width: 60, height: 60, fontSize: 28, fontWeight: 700, boxShadow: '0 2px 12px #0006'
            }}>
            🧑‍🚀
          </button>
          <SpaceQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />
          <button
            aria-label="Open Space Story Mode"
            onClick={() => setStoryOpen(true)}
            style={{
              position: 'fixed', left: 32, bottom: 190, zIndex: 1000,
              ...buttonBase, width: 60, height: 60, fontSize: 28, fontWeight: 700, boxShadow: '0 2px 12px #0006'
            }}>
            🌌
          </button>
          {apod && <SpaceStory apod={apod} open={storyOpen} onClose={() => setStoryOpen(false)} />}
          <button
            aria-label="Open APOD Timeline"
            onClick={() => setTimelineOpen(true)}
            style={{
              position: 'fixed', left: 32, bottom: 270, zIndex: 1000,
              ...buttonBase, width: 60, height: 60, fontSize: 28, fontWeight: 700, boxShadow: '0 2px 12px #0006'
            }}>
            🕑
          </button>
          <ApodTimeline open={timelineOpen} onClose={() => setTimelineOpen(false)} />
        </div>
      </UserProvider>
    </HighContrastProvider>
  );
}

export default App;
