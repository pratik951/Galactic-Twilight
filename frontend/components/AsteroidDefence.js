import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AsteroidDefence() {
    const [asteroids, setAsteroids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch asteroid data from NASA API
        const fetchAsteroids = async () => {
            try {
                const response = await axios.get(
                    'https://api.nasa.gov/neo/rest/v1/feed?start_date=2023-01-01&end_date=2023-01-07&api_key=DEMO_KEY'
                );
                setAsteroids(response.data.near_earth_objects);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch asteroid data.');
                setLoading(false);
            }
        };

        fetchAsteroids();
    }, []);

    if (loading) {
        return <div>Loading asteroid data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Asteroid Defence</h1>
            <ul>
                {Object.keys(asteroids).map((date) => (
                    <li key={date}>
                        <h2>Date: {date}</h2>
                        <ul>
                            {asteroids[date].map((asteroid) => (
                                <li key={asteroid.id}>
                                    <strong>{asteroid.name}</strong> - Diameter: {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AsteroidDefence;