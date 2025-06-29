import React, { useEffect, useState, useRef } from 'react';
import { useUser } from './UserContext';
import './AsteroidDefenseGame.css';

// Simple arcade-style asteroid defense game using real NEO data
const GAME_DURATION = 60; // seconds
const MAX_ASTEROIDS = 10; // Maximum asteroids to hit for "congratulations"

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Voice narration for asteroid facts and game events
function getVoicesAsync() {
  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      console.log('Voices loaded:', voices);
      return resolve(voices);
    }

    // Retry loading voices if not immediately available
    const retryInterval = setInterval(() => {
      voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        console.log('Voices loaded after retry:', voices);
        clearInterval(retryInterval);
        resolve(voices);
      }
    }, 200);

    // Timeout after 2 seconds if voices are still not available
    setTimeout(() => {
      clearInterval(retryInterval);
      console.warn('Voices could not be loaded within the timeout period.');
      resolve([]);
    }, 2000);
  });
}

async function speak(text, onFail, utterRef) {
  if ('speechSynthesis' in window) {
    try {
      const voices = await getVoicesAsync();
      if (!voices.length) {
        console.error('No voices available for speech synthesis.');
        if (onFail) onFail(true);
        return;
      }

      // Prefer a female English voice
      let voice = voices.find(v => v.lang && v.lang.startsWith('en') && v.name && /female|woman|girl/i.test(v.name));
      if (!voice) {
        console.warn('No female English voice found. Using the first available English voice.');
        voice = voices.find(v => v.lang && v.lang.startsWith('en')) || voices[0];
      }

      const utter = new window.SpeechSynthesisUtterance(text);
      utter.voice = voice;
      utter.rate = 1.25; // Set speech rate to 1.25x for seamless narration
      utter.pitch = 1; // Keep pitch neutral for a natural tone
      utter.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        if (onFail) onFail(true);
      };
      utter.onstart = () => {
        console.log('Speech synthesis started.');
        if (onFail) onFail(false);
      };
      utter.onend = () => {
        console.log('Speech synthesis finished.');
      };
      if (utterRef) utterRef.current = utter;

      // Debugging: Log the selected voice
      console.log('Using voice:', voice);

      // Speak the text
      window.speechSynthesis.cancel(); // Cancel any ongoing speech to avoid conflicts
      window.speechSynthesis.speak(utter);

      // Debugging: Check if speechSynthesis is speaking
      setTimeout(() => {
        if (window.speechSynthesis.speaking) {
          console.log('Speech synthesis is currently speaking.');
        } else {
          console.warn('Speech synthesis is not speaking.');
        }
      }, 100);

      if (window.__loggedVoices !== true) {
        console.log('Available voices:', voices);
        window.__loggedVoices = true;
      }
    } catch (e) {
      console.error('Error during speech synthesis:', e);
      if (onFail) onFail(true);
    }
  } else {
    console.error('Speech synthesis not supported in this browser.');
    if (onFail) onFail(true);
  }
}

const AsteroidDefenseGame = () => {
  const { awardBadge, logAction } = useUser();
  const [asteroids, setAsteroids] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(GAME_DURATION);
  const [showFact, setShowFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [factQueue, setFactQueue] = useState([]);
  const [currentFact, setCurrentFact] = useState(null);
  const [speechError, setSpeechError] = useState(false);
  const [speechReady, setSpeechReady] = useState(false);
  const [congrats, setCongrats] = useState(false); // New state for "congratulations"
  const intervalRef = useRef();
  const utterRef = useRef();

  useEffect(() => {
    setLoading(true);
    setError(null);
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    fetch(`${backendUrl}/api/neo?start_date=2025-06-18&end_date=2025-06-18`)
      .then(res => res.json())
      .then(data => {
        const neos = Object.values(data.near_earth_objects || {}).flat();
        setAsteroids(neos.slice(0, MAX_ASTEROIDS).map(neo => {
          // Creative fact generation
          const diameter = neo.estimated_diameter?.meters?.estimated_diameter_max?.toFixed(1);
          const miss = neo.close_approach_data?.[0]?.miss_distance?.kilometers?.split('.')[0];
          const approach = neo.close_approach_data?.[0]?.close_approach_date_full || neo.close_approach_data?.[0]?.close_approach_date;
          const funFacts = [
            `Asteroid ${neo.name} zooms by Earth at a distance of ${miss ? miss + ' km' : 'unknown distance'}!`,
            `Did you know? ${neo.name} is about ${diameter ? diameter + ' meters' : 'unknown size'} wide!`,
            `Watch out! ${neo.name} made a close approach on ${approach || 'an unknown date'}!`,
            `Asteroid ${neo.name} is a true space traveler!`,
            `You just blasted ${neo.name}!`];
          const factIdx = Math.floor(Math.random() * funFacts.length);
          return {
            ...neo,
            x: getRandomInt(10, 90),
            y: 0,
            speed: getRandomInt(1, 3),
            creativeFact: funFacts[factIdx],
          };
        }));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load asteroid data.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (gameOver || congrats) return;
    intervalRef.current = setInterval(() => {
      setAsteroids(asts => asts.map(a => ({ ...a, y: a.y + a.speed })));
      setTimer(t => {
        if (t <= 1) {
          setGameOver(true);
          clearInterval(intervalRef.current);
          logAction('Asteroid Defense Game completed!');
          return 0;
        }
        return t - 1;
      });
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, [gameOver, congrats, logAction]);

  useEffect(() => {
    if (factQueue.length > 0 && !currentFact) {
      setCurrentFact(factQueue[0]);
      setFactQueue(fq => fq.slice(1));
    }
  }, [factQueue, currentFact]);

  // Helper to test speech after user gesture
  const handleTestSpeech = async () => {
    setSpeechError(false);
    setSpeechReady(true);
    console.log('Testing speech synthesis...');
    await speak(
      'Speech synthesis is working! You will hear asteroid facts during the game.',
      (err) => {
        if (err) {
          console.error('Speech synthesis test failed.');
          setSpeechError(true);
        } else {
          console.log('Speech synthesis test succeeded.');
          setSpeechError(false);
        }
      },
      utterRef
    );
  };

  useEffect(() => {
    if (currentFact && speechReady) { // Only speak if user has enabled speech
      setSpeechError(false); // Clear error before trying
      speak(currentFact, (err) => {
        if (err === true) setSpeechError(true);
        else setSpeechError(false); // Clear error if speech works
      }, utterRef);
      const timer = setTimeout(() => setCurrentFact(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentFact, speechReady]);

  useEffect(() => {
    if (score >= MAX_ASTEROIDS) {
      setCongrats(true);
      setGameOver(true);
      speak('Congratulations! You hit all the asteroids! 🚀', () => {}, utterRef);
    }
  }, [score]);

  // Only speak game over once
  const hasSpokenGameOver = useRef(false);

  useEffect(() => {
    if (gameOver && speechReady && !hasSpokenGameOver.current) {
      hasSpokenGameOver.current = true;
      speak('Game Over! Final Score: ' + score);
      if (score > 0) awardBadge('asteroid-hunter');
      logAction('Asteroid Defense Game completed!');
    }
    if (!gameOver) {
      hasSpokenGameOver.current = false;
    }
  }, [gameOver, score, awardBadge, logAction, speechReady]);

  return (
    <div className="asteroid-game" aria-label="Asteroid Defense Game">
      <h2>Asteroid Defense Game</h2>
      {loading && (
        <div style={{ textAlign: 'center', margin: '1rem' }}>
          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <svg width={36} height={36} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1.2s linear infinite' }}>
              <g>
                <ellipse cx="24" cy="44" rx="6" ry="2.5" fill="#ffd700" opacity="0.5" />
                <path d="M24 4C28 10 36 24 24 44C12 24 20 10 24 4Z" fill="#fff" stroke="#ffd700" strokeWidth="2" />
                <circle cx="24" cy="16" r="3" fill="#ffd700" />
              </g>
            </svg>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      )}
      {error && <div style={{ color: 'salmon', textAlign: 'center', margin: '1rem' }}>{error}</div>}
      {!loading && !error && (
        <>
          <button
            style={{position:'absolute',top:10,right:10,zIndex:20,padding:'8px 18px',background:'#23243a',color:'#ffd700',border:'none',borderRadius:6,cursor:'pointer',boxShadow:'0 2px 8px #0008'}}
            onClick={handleTestSpeech}
            aria-label="Test Speech Synthesis"
          >
            Test Speech
          </button>
          <div className="game-area" tabIndex={0} aria-label="Game Area">
            {asteroids.map((a) => (
              <div
                key={a.id}
                className="asteroid"
                style={{ left: `${a.x}%`, top: `${a.y}%` }}
                tabIndex={0}
                aria-label={'Asteroid ' + a.name}
                onClick={() => {
                  setScore(s => s + 1);
                  setFactQueue(fq => [...fq, a.creativeFact]);
                  setAsteroids(asts => asts.filter(ast => ast.id !== a.id));
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setScore(s => s + 1);
                    setFactQueue(fq => [...fq, a.creativeFact]);
                    setAsteroids(asts => asts.filter(ast => ast.id !== a.id));
                  }
                }}
              >
                🪨
              </div>
            ))}
          </div>
          <div className="scoreboard">
            Score: {score} | Time Left: {timer}s
          </div>
          {currentFact && (
            <div className="fact-toast" style={{position:'absolute',top:10,left:'50%',transform:'translateX(-50%)',background:'#23243a',color:'#ffd700',padding:'12px 24px',borderRadius:8,boxShadow:'0 2px 8px #0008',zIndex:10,transition:'opacity 0.5s'}}>
              {currentFact}
            </div>
          )}
          {gameOver && !congrats && (
            <div className="game-over" style={{ textAlign: 'center', marginTop: 24 }}>
              Game Over! Final Score: {score}
            </div>
          )}
          {congrats && (
            <div className="congrats-message" style={{ textAlign: 'center', marginTop: 24 }}>
              🎉 Congratulations! You hit all the asteroids! 🚀
              <br />
              <button
                style={{ marginTop: 16, padding: '10px 28px', background: '#ffd700', color: '#23243a', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #0008' }}
                onClick={() => {
                  setGameOver(false);
                  setCongrats(false);
                  setScore(0);
                  setTimer(GAME_DURATION);
                  setFactQueue([]);
                  setCurrentFact(null);
                  setShowFact(null);
                  setError(null);

                  // Reset asteroids and start the game immediately
                  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
                  fetch(`${backendUrl}/api/neo?start_date=2025-06-18&end_date=2025-06-18`)
                    .then(res => res.json())
                    .then(data => {
                      const neos = Object.values(data.near_earth_objects || {}).flat();
                      setAsteroids(neos.slice(0, MAX_ASTEROIDS).map(neo => {
                        const diameter = neo.estimated_diameter?.meters?.estimated_diameter_max?.toFixed(1);
                        const miss = neo.close_approach_data?.[0]?.miss_distance?.kilometers?.split('.')[0];
                        const approach = neo.close_approach_data?.[0]?.close_approach_date_full || neo.close_approach_data?.[0]?.close_approach_date;
                        const funFacts = [
                          `Asteroid ${neo.name} zooms by Earth at a distance of ${miss ? miss + ' km' : 'unknown distance'}!`,
                          `Did you know? ${neo.name} is about ${diameter ? diameter + ' meters' : 'unknown size'} wide!`,
                          `Watch out! ${neo.name} made a close approach on ${approach || 'an unknown date'}!`,
                          `Asteroid ${neo.name} is a true space traveler!`,
                          `You just blasted ${neo.name}!`
                        ];
                        const factIdx = Math.floor(Math.random() * funFacts.length);
                        return {
                          ...neo,
                          x: getRandomInt(10, 90),
                          y: 0,
                          speed: getRandomInt(1, 3),
                          creativeFact: funFacts[factIdx],
                        };
                      }));
                      setGameOver(false); // Ensure the game restarts
                    })
                    .catch(() => {
                      setError('Failed to load asteroid data.');
                    });
                }}
              >
                Play Again?
              </button>
            </div>
          )}
          {speechError && (
            <div style={{ position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%)', background: '#ffb347', color: '#23243a', padding: '10px 20px', borderRadius: 8, boxShadow: '0 2px 8px #0008', zIndex: 11 }}>
              Speech not supported or blocked. Please check your browser settings to enable audio narration.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AsteroidDefenseGame;