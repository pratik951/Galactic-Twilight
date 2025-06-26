import React, { useState, useEffect } from 'react';

function AsteroidDefenseGame() {
    const [gameState, setGameState] = useState('playing');
    const [asteroids, setAsteroids] = useState([]);

    useEffect(() => {
        // Fetch asteroid data or initialize game logic
        const initializeGame = () => {
            // Example logic to initialize asteroids
            setAsteroids([
                { id: 1, name: 'Asteroid 1', size: 'Large' },
                { id: 2, name: 'Asteroid 2', size: 'Medium' },
            ]);
        };

        initializeGame();
    }, []);

    return (
        <div>
            <h1>Asteroid Defense Game</h1>
            <p>Game State: {gameState}</p>
            <ul>
                {asteroids.map((asteroid) => (
                    <li key={asteroid.id}>
                        <strong>{asteroid.name}</strong> - Size: {asteroid.size}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AsteroidDefenseGame;
