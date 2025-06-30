import React, { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
const MarsRoverGallery = React.lazy(() => import('./MarsRoverGallery'));
const EpicGallery = React.lazy(() => import('./EpicGallery'));
const NeoChart = React.lazy(() => import('./NeoChart'));
import SpaceCapsule, { useSpaceCapsule } from './SpaceCapsule';
import SpaceQuiz from './SpaceQuiz';
import SpaceStory from './SpaceStory';
import ApodTimeline from './ApodTimeline';
import Starfield from './Starfield';
import SolarSystemPage from './SolarSystemPage';
import { UserProvider } from './UserContext';
import AsteroidDefenseGame from './AsteroidDefenseGame';
import './i18n';
import ProfileButton from './ProfileButton';
import ProfileModal from './ProfileModal';
import NotificationBell from './NotificationBell';

function Navbar({ page, setPage }) {
  return (
    <nav style={{
      display: 'flex',
      gap: 16,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(30,32,50,0.95)',
      borderRadius: 12,
      padding: '8px 0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
    }}>
      <button onClick={() => setPage('apod')} style={{ ...buttonBase, fontWeight: page === 'apod' ? 'bold' : 'normal', background: page === 'apod' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'apod' ? '#23243a' : '#ffd700', fontSize: 16 }}>APOD</button>
      <button onClick={() => setPage('mars')} style={{ ...buttonBase, fontWeight: page === 'mars' ? 'bold' : 'normal', background: page === 'mars' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'mars' ? '#23243a' : '#ffd700', fontSize: 16 }}>Mars</button>
      <button onClick={() => setPage('epic')} style={{ ...buttonBase, fontWeight: page === 'epic' ? 'bold' : 'normal', background: page === 'epic' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'epic' ? '#23243a' : '#ffd700', fontSize: 16 }}>EPIC</button>
      <button onClick={() => setPage('neo')} style={{ ...buttonBase, fontWeight: page === 'neo' ? 'bold' : 'normal', background: page === 'neo' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'neo' ? '#23243a' : '#ffd700', fontSize: 16 }}>NEO</button>
      {/* Solar button removed */}
      <button onClick={() => setPage('asteroid')} style={{ ...buttonBase, fontWeight: page === 'asteroid' ? 'bold' : 'normal', background: page === 'asteroid' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'asteroid' ? '#23243a' : '#ffd700', fontSize: 16 }}>Asteroid Defense</button>
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
const mainBg = {
  minHeight: '100vh',
  background: 'radial-gradient(circle, #1a1b2e 0%, #0a0a1a 100%)',
  color: '#fff',
  fontFamily: 'Segoe UI, Arial, sans-serif',
  padding: 0,
  margin: 0,
  fontSize: 15,
  boxSizing: 'border-box',
  width: '100vw',
  overflowX: 'hidden',
  position: 'relative',
};

const buttonBase = {
  background: 'linear-gradient(90deg, #ff8c00 60%, #ff4500 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontWeight: 700,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  outline: 'none',
  fontSize: 15,
  padding: '8px 20px',
  minWidth: 0,
  minHeight: 0,
};

function Card({ children, style }) {
  return (
    <div style={{
      background: 'linear-gradient(120deg, #23243a 80%, #2d2d4a 100%)',
      borderRadius: 14,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
      padding: 20,
      margin: '0 auto',
      marginBottom: 20,
      border: 'none', // Remove white border
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
  const [updates, setUpdates] = useState([]);
  const [missionNotifications, setMissionNotifications] = useState([]);
  const { addItem: addToCapsule } = useSpaceCapsule();
  const wsRef = useRef(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const fetchApod = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.REACT_APP_API_URL || '';
        const res = await axios.get(`${apiUrl}/api/apod`);
        setApod(res.data);
        console.log('Fetched APOD data:', res.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data from NASA backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchApod();
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) return;
    const apiUrl = process.env.REACT_APP_API_URL || '';
    const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
    const wsHost = apiUrl.replace(/^https?:\/\//, '');
    const ws = new window.WebSocket(`${wsProtocol}://${wsHost}`);
    wsRef.current = ws;
    ws.onopen = () => setWsConnected(true);
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setMissionNotifications((prev) => [update, ...prev].slice(0, 10));
    };
    ws.onclose = () => {
      setWsConnected(false);
      wsRef.current = null;
    };
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
    const [isOpen, setIsOpen] = useState(false);

    const generateCaption = async () => {
      if (!apod) {
        setError('APOD data is missing.');
        return;
      }

      setLoading(true);
      setError(null);
      setCaption('');

      try {
        const apiUrl = process.env.REACT_APP_API_URL || '';
        const res = await axios.post(`${apiUrl}/api/ai-caption`, {
          title: apod.title,
          explanation: apod.explanation,
        });
        setCaption(res.data.caption);
        setIsOpen(true);
      } catch (err) {
        setError('Failed to generate AI caption. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    return (
      <div style={{ marginTop: 16 }} onClick={handleClose}>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent closing when clicking the button
            generateCaption();
          }}
          disabled={loading}
          style={{ ...buttonBase, padding: '6px 12px', fontSize: 14 }}
        >
          {loading ? 'Generating...' : 'Generate AI Caption'}
        </button>
        {error && <p style={{ color: 'salmon', marginTop: 8 }}>{error}</p>}
        {isOpen && caption && (
          <div
            style={{
              marginTop: 12,
              fontStyle: 'italic',
              background: 'rgba(34,34,60,0.95)',
              color: '#ffd700',
              padding: 16,
              borderRadius: 8,
              boxShadow: '0 2px 8px #0008',
              maxWidth: 500,
              wordBreak: 'break-word',
            }}
          >
            {caption}
            {addToCapsule && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent closing when clicking the button
                  addToCapsule({ id: apod.date + '-ai', type: 'ai', caption });
                }}
                style={{ marginLeft: 12, ...buttonBase, padding: '4px 10px' }}
              >
                Save to Capsule
              </button>
            )}
          </div>
        )}
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

  // Add floating feature buttons styled as round circles with space-related logos
  const featureButtonStyle = {
    position: 'fixed',
    bottom: 32,
    left: 32,
    zIndex: 1000,
    width: 60,
    height: 60,
    borderRadius: '50%',
    fontSize: 28,
    fontWeight: 700,
    boxShadow: '0 2px 12px #0006',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    background: '#1a1b2e',
    color: '#ffd700',
    border: 'none',
    cursor: 'pointer'
  };

  const featureLogos = {
    'Space Quiz': '🧑‍🚀',
    'APOD Timeline': '🌌',
    'Capsule': '🚀',
    'Space Story Mode': '📖'
  };

  const features = [
    {
      name: 'Space Quiz',
      description: 'Test your knowledge about space!',
      action: () => setQuizOpen(true),
    },
    {
      name: 'APOD Timeline',
      description: 'Explore NASA’s Astronomy Picture of the Day over time.',
      action: () => setTimelineOpen(true),
    },
    {
      name: 'Capsule',
      description: 'Store your favorite space moments.',
      action: () => setCapsuleOpen(true),
    },
    {
      name: 'Space Story Mode',
      description: 'Immerse yourself in a space adventure.',
      action: () => setStoryOpen(true),
    },
  ];

  const dialogRef = useRef();

  const handleBackdropClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      setIsChatOpen(false);
    }
  };

  // Pass a callback to MarsRoverGallery to add notifications
  const handleMissionNotification = (notif) => {
    setMissionNotifications((prev) => [notif, ...prev].slice(0, 10));
  };

  return (
    <UserProvider>
      <div style={mainBg}>
        <Starfield />
        <ProfileButton onClick={() => setProfileOpen(true)} />
        <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 8px' }}>
          <header style={{
            textAlign: 'center',
            padding: '20px 0',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#ffd700',
            textShadow: '0 0 10px #ffd700, 0 0 20px #ffb347',
            animation: 'glow 1.5s infinite',
          }}>
            Galactic Twilight ✨
          </header>
          <Navbar page={page} setPage={setPage} />
          {page === 'apod' && (
            <Card>
              <h1 style={{ color: '#ffd700', marginBottom: 8 }}>NASA Astronomy Picture of the Day</h1>
              {loading && <Spinner />}
              {error && <p style={{ color: 'salmon' }}>{error}</p>}
              {apod && (
                <div style={{ width: '100%' }}>
                  <div style={{
                    width: '100%',
                    maxWidth: 900,
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    position: 'relative',
                    padding: '8px 0',
                    boxSizing: 'border-box',
                  }}>
                    <img 
                      src={apod.url} 
                      alt={apod.title} 
                      style={{
                        flex: 1,
                        width: '100%',
                        maxWidth: 'none',
                        minWidth: 320,
                        height: 400,
                        objectFit: 'cover',
                        borderRadius: 14,
                        boxShadow: '0 4px 18px #000a',
                        marginRight: 32,
                        transition: 'all 0.2s',
                        display: 'block',
                      }}
                    />
                    <div style={{ minWidth: 0, width: 320, maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', paddingTop: 8 }}>
                      <AICaption apod={apod} addToCapsule={addToCapsule} />
                      <h2 style={{ color: '#fff', margin: '24px 0 6px 0', fontSize: 22, fontWeight: 600, wordBreak: 'break-word', alignSelf: 'flex-start' }}>{apod.title}</h2>
                      <p style={{ margin: '10px 0 0 0', color: '#ffd700', fontWeight: 500, fontSize: 15, alignSelf: 'flex-start' }}><b>Date:</b> {apod.date}</p>
                    </div>
                  </div>
                  <div style={{
                    width: '100%',
                    maxWidth: 900,
                    margin: '24px auto 0 auto',
                    boxSizing: 'border-box',
                  }}>
                    <p style={{ color: '#e0e0e0', margin: 0, fontSize: 17, lineHeight: 1.7, wordBreak: 'break-word', textAlign: 'justify' }}>{apod.explanation}</p>
                  </div>
                </div>
              )}
            </Card>
          )}
          {page === 'mars' && (
            <Card>
              <Suspense fallback={<Spinner />}>
                <MarsRoverGallery onMissionNotify={handleMissionNotification} />
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
          {/* Solar page removed */}
          {page === 'asteroid' && (
            <Card><AsteroidDefenseGame /></Card>
          )}
        </div>
        <SpaceCapsule open={capsuleOpen} onClose={() => setCapsuleOpen(false)} />
        <SpaceQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />
        <SpaceStory apod={apod} open={storyOpen} onClose={() => setStoryOpen(false)} />
        <ApodTimeline open={timelineOpen} onClose={() => setTimelineOpen(false)} />
        {features.map((feature, index) => (
          <button
            key={index}
            aria-label={feature.name}
            title={feature.description}
            style={{ ...featureButtonStyle, bottom: 32 + index * 80 }}
            onClick={feature.action} // Ensure the action is invoked correctly
          >
            {featureLogos[feature.name]}
          </button>
        ))}
        <NotificationBell notifications={missionNotifications} onBellClick={connectWebSocket} wsConnected={wsConnected} />
        <style>
          {`
            @keyframes glow {
              0% { text-shadow: 0 0 10px #ffd700, 0 0 20px #ffb347; }
              50% { text-shadow: 0 0 20px #ffd700, 0 0 30px #ffb347; }
              100% { text-shadow: 0 0 10px #ffd700, 0 0 20px #ffb347; }
            }
          `}
        </style>
      </div>
    </UserProvider>
  );
}

export default App;
