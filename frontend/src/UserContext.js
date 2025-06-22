import React, { createContext, useContext, useState, useEffect } from 'react';

const BADGE_DEFS = [
  { id: 'mars-explorer', name: 'Mars Explorer', desc: 'Viewed the Mars Rover Gallery', icon: '🚗' },
  { id: 'asteroid-hunter', name: 'Asteroid Hunter', desc: 'Viewed the NEO Chart', icon: '☄️' },
  { id: 'quiz-master', name: 'Quiz Master', desc: 'Completed the Space Quiz', icon: '🧑‍🚀' },
  { id: 'capsule-collector', name: 'Capsule Collector', desc: 'Saved an item to Space Capsule', icon: '📦' },
  { id: 'storyteller', name: 'Storyteller', desc: 'Used Space Story Mode', icon: '📖' },
];

const defaultState = {
  badges: [],
  logbook: [],
};

const UserContext = createContext();

export function UserProvider({ children }) {
  const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem('badges') || '[]'));
  const [logbook, setLogbook] = useState(() => JSON.parse(localStorage.getItem('logbook') || '[]'));

  useEffect(() => { localStorage.setItem('badges', JSON.stringify(badges)); }, [badges]);
  useEffect(() => { localStorage.setItem('logbook', JSON.stringify(logbook)); }, [logbook]);

  const awardBadge = (id) => {
    if (!badges.includes(id)) {
      setBadges([...badges, id]);
      const badge = BADGE_DEFS.find(b => b.id === id);
      if (badge) logAction(`Earned badge: ${badge.name}`);
    }
  };
  const logAction = (action) => {
    setLogbook(lg => [...lg, { action, date: new Date().toISOString() }]);
  };

  return (
    <UserContext.Provider value={{ badges, logbook, awardBadge, logAction, BADGE_DEFS }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
