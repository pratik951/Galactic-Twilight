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
function speak(text, onFail) {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.onerror = () => { if (onFail) onFail(true); };
      utter.onstart = () => { if (onFail) onFail(false); };
      window.speechSynthesis.speak(utter);
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
  const intervalRef = useRef();

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
      speak('Game Over! Final Score: ' + score);
      if (score > 0) awardBadge('asteroid-hunter');
      logAction('Asteroid Defense Game completed!');
    }
  }, [gameOver, score, awardBadge, logAction]);

  return (
    <div className={`asteroid-game${highContrast ? ' high-contrast' : ''}`} aria-label="Asteroid Defense Game">
      <h2>Asteroid Defense Game</h2>
      {loading && <div style={{ textAlign: 'center', margin: '1rem' }}>Loading...</div>}
      {error && <div style={{ color: 'salmon', textAlign: 'center', margin: '1rem' }}>{error}</div>}
      {!loading && !error && (
        <>
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
          {gameOver && <div className="game-over">Game Over! Final Score: {score}</div>}
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