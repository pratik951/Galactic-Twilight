import React, { Suspense, useEffect, useState, useRef } from 'react';
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

function Navbar({ page, setPage, updates, initializeWebSocket }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationTimeoutRef = useRef(null);

  const handleNotificationsClick = () => {
    if (!showNotifications) {
      initializeWebSocket(); // Initialize WebSocket only when opening notifications for the first time
    }
    setShowNotifications(true);

    // Clear any existing timeout and set a new one to auto-minimize after 7-8 seconds
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotifications(false);
    }, 7500); // 7.5 seconds
  };

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
      <button onClick={() => setPage('solar')} style={{ ...buttonBase, fontWeight: page === 'solar' ? 'bold' : 'normal', background: page === 'solar' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'solar' ? '#23243a' : '#ffd700', fontSize: 16 }}>Solar</button>
      <button onClick={() => setPage('asteroid')} style={{ ...buttonBase, fontWeight: page === 'asteroid' ? 'bold' : 'normal', background: page === 'asteroid' ? 'linear-gradient(90deg, #ffd700 60%, #ffb347 100%)' : '#23243a', color: page === 'asteroid' ? '#23243a' : '#ffd700', fontSize: 16 }}>Asteroid Defense</button>
      <button onClick={handleNotificationsClick} style={{ ...buttonBase, background: '#23243a', color: '#ffd700', fontSize: 16 }}>Notifications</button>
      {showNotifications && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '20px',
          background: 'rgba(30,32,50,0.95)',
          borderRadius: '8px',
          padding: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          maxHeight: '300px',
          overflowY: 'auto',
        }}>
          <h4 style={{ color: '#ffd700', margin: 0 }}>Updates</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {updates.map((update, index) => (
              <li key={index} style={{ color: '#fff', marginBottom: '5px' }}>
                {update.message} - {new Date(update.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
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
      border: '1px solid rgba(255, 215, 0, 0.3)',
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
  const { addItem: addToCapsule } = useSpaceCapsule();
  const wsRef = useRef(null);

  useEffect(() => {
    const fetchApod = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/apod');
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

  const initializeWebSocket = () => {
    if (wsRef.current) return; // Prevent multiple WebSocket connections

    const ws = new WebSocket('ws://localhost:5000'); // Connect to the WebSocket server
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established.');
    };

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      console.log('Received update:', update);
      setUpdates((prevUpdates) => {
        const newUpdates = [...prevUpdates, update];
        return newUpdates.length > 10 ? newUpdates.slice(-10) : newUpdates; // Keep only the last 10 updates
      });
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed.');
      wsRef.current = null; // Reset the WebSocket reference
    };
  };

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
        const res = await axios.post('http://localhost:5000/api/ai-caption', {
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

  return (
    <UserProvider>
      <div style={mainBg}>
        <Starfield />
        <ProfileButton onClick={() => setProfileOpen(true)} />
        <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, position: 'relative', zIndex: 1 }}>
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
          <Navbar page={page} setPage={setPage} updates={updates} initializeWebSocket={initializeWebSocket} />
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
