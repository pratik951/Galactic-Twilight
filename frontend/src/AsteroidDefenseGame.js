import React, { useEffect, useState, useRef } from 'react';
import { useUser } from './UserContext';
import './AsteroidDefenseGame.css';
import { useHighContrast } from './HighContrastContext';

// Simple arcade-style asteroid defense game using real NEO data
const GAME_DURATION = 60; // seconds

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Voice narration for asteroid facts and game events
<<<<<<< HEAD
function getVoicesAsync() {
  return new Promise(resolve => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) return resolve(voices);
    window.speechSynthesis.onvoiceschanged = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      resolve(loadedVoices);
    };
  });
}

async function speak(text, onFail, utterRef) {
  if ('speechSynthesis' in window) {
    try {
      const voices = await getVoicesAsync();
      if (!voices.length) {
        if (onFail) onFail(true);
        return;
      }
      // Prefer a female English voice if available
      let voice = voices.find(v => v.lang && v.lang.startsWith('en') && v.gender === 'female');
      if (!voice) {
        // Some browsers do not provide gender, so match by name
        voice = voices.find(v => v.lang && v.lang.startsWith('en') && v.name && /female|woman|girl|zira|susan|samantha|linda|emma|victoria|karen|allison|julie|lucy|olivia|zoe|amy|joanna|ivy|kimberly|kendra|susan|tessa|vanessa|zoey/i.test(v.name));
      }
      if (!voice) {
        // Fallback to any English voice
        voice = voices.find(v => v.lang && v.lang.startsWith('en')) || voices[0];
      }
      const utter = new window.SpeechSynthesisUtterance(text);
      if (voice) utter.voice = voice;
      utter.rate = 1.5; // Set speech rate to 1.5x
      utter.onerror = () => { if (onFail) onFail(true); };
      utter.onstart = () => { if (onFail) onFail(false); };
      if (utterRef) utterRef.current = utter;
      window.speechSynthesis.speak(utter);
      if (window.__loggedVoices !== true) {
        console.log('Available voices:', voices);
        window.__loggedVoices = true;
      }
=======
function speak(text, onFail) {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.onerror = () => { if (onFail) onFail(true); };
      utter.onstart = () => { if (onFail) onFail(false); };
      window.speechSynthesis.speak(utter);
>>>>>>> 213db378c9fbf41e664e26138b161ec1992d3fbc
    } catch (e) {
      if (onFail) onFail(true);
    }
  } else {
    if (onFail) onFail(true);
  }
}

const AsteroidDefenseGame = () => {
  const { awardBadge, logAction } = useUser();
  const { highContrast } = useHighContrast();
  const [asteroids, setAsteroids] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(GAME_DURATION);
  const [showFact, setShowFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [factQueue, setFactQueue] = useState([]); // queue for facts
  const [currentFact, setCurrentFact] = useState(null); // currently displayed fact
  const [speechError, setSpeechError] = useState(false);
<<<<<<< HEAD
  const [speechReady, setSpeechReady] = useState(false); // tracks if user has enabled speech
  const intervalRef = useRef();
  const utterRef = useRef(); // add this near other refs
=======
  const intervalRef = useRef();
>>>>>>> 213db378c9fbf41e664e26138b161ec1992d3fbc

  useEffect(() => {
    setLoading(true);
    setError(null);
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    fetch(`${backendUrl}/api/neo?start_date=2025-06-18&end_date=2025-06-18`)
      .then(res => res.json())
      .then(data => {
        const neos = Object.values(data.near_earth_objects || {}).flat();
        setAsteroids(neos.slice(0, 10).map(neo => {
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
    if (gameOver) return;
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
  }, [gameOver, logAction]);

  useEffect(() => {
    if (factQueue.length > 0 && !currentFact) {
      setCurrentFact(factQueue[0]);
      setFactQueue(fq => fq.slice(1));
    }
  }, [factQueue, currentFact]);

<<<<<<< HEAD
  // Helper to test speech after user gesture
  const handleTestSpeech = async () => {
    setSpeechError(false);
    setSpeechReady(true);
    await speak(
      'Speech synthesis is working! You will hear asteroid facts during the game.',
      (err) => setSpeechError(!!err),
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

  // Only speak game over once
  const hasSpokenGameOver = useRef(false);

  useEffect(() => {
    if (gameOver && speechReady && !hasSpokenGameOver.current) {
      hasSpokenGameOver.current = true;
=======
  useEffect(() => {
    if (currentFact) {
      setSpeechError(false);
      speak(currentFact, (err) => {
        // Only set error if err is true (utterance failed or not supported)
        setSpeechError(err === true);
      });
      const timer = setTimeout(() => setCurrentFact(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentFact]);

  useEffect(() => {
    if (gameOver) {
>>>>>>> 213db378c9fbf41e664e26138b161ec1992d3fbc
      speak('Game Over! Final Score: ' + score);
      if (score > 0) awardBadge('asteroid-hunter');
      logAction('Asteroid Defense Game completed!');
    }
<<<<<<< HEAD
    if (!gameOver) {
      hasSpokenGameOver.current = false;
    }
  }, [gameOver, score, awardBadge, logAction, speechReady]);
=======
  }, [gameOver, score, awardBadge, logAction]);
>>>>>>> 213db378c9fbf41e664e26138b161ec1992d3fbc

  return (
    <div className={`asteroid-game${highContrast ? ' high-contrast' : ''}`} aria-label="Asteroid Defense Game">
      <h2>Asteroid Defense Game</h2>
      {loading && <div style={{ textAlign: 'center', margin: '1rem' }}>Loading...</div>}
      {error && <div style={{ color: 'salmon', textAlign: 'center', margin: '1rem' }}>{error}</div>}
      {!loading && !error && (
        <>
<<<<<<< HEAD
          <button
            style={{position:'absolute',top:10,right:10,zIndex:20,padding:'8px 18px',background:'#23243a',color:'#ffd700',border:'none',borderRadius:6,cursor:'pointer',boxShadow:'0 2px 8px #0008'}}
            onClick={handleTestSpeech}
            aria-label="Test Speech Synthesis"
          >
            Test Speech
          </button>
=======
>>>>>>> 213db378c9fbf41e664e26138b161ec1992d3fbc
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
<<<<<<< HEAD
          {gameOver && (
            <div className="game-over" style={{textAlign:'center',marginTop:24}}>
              Game Over! Final Score: {score}
              <br />
              <button
                style={{marginTop:16,padding:'10px 28px',background:'#ffd700',color:'#23243a',border:'none',borderRadius:8,fontWeight:700,fontSize:18,cursor:'pointer',boxShadow:'0 2px 8px #0008'}}
                onClick={() => {
                  setGameOver(false);
                  setScore(0);
                  setTimer(GAME_DURATION);
                  setAsteroids([]);
                  setFactQueue([]);
                  setCurrentFact(null);
                  setShowFact(null);
                  setError(null);
                  setLoading(true);
                  // Re-fetch asteroids
                  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
                  fetch(`${backendUrl}/api/neo?start_date=2025-06-18&end_date=2025-06-18`)
                    .then(res => res.json())
                    .then(data => {
                      const neos = Object.values(data.near_earth_objects || {}).flat();
                      setAsteroids(neos.slice(0, 10).map(neo => {
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
                }}
              >
                Play Again?
              </button>
            </div>
          )}
=======
          {gameOver && <div className="game-over">Game Over! Final Score: {score}</div>}
>>>>>>> 213db378c9fbf41e664e26138b161ec1992d3fbc
          {speechError && (
            <div style={{position:'absolute',top:50,left:'50%',transform:'translateX(-50%)',background:'#ffb347',color:'#23243a',padding:'10px 20px',borderRadius:8,boxShadow:'0 2px 8px #0008',zIndex:11}}>
              Speech not supported or blocked. Please check your browser settings to enable audio narration.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AsteroidDefenseGame;