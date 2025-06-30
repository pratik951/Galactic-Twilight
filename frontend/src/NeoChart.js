import React, { useState } from 'react';
// Simple SVG Loader
function Loader({ size = 36 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: size }}>
      <svg width={size} height={size} viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="#ffd700" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function NeoChart() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [neos, setNeos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNeos = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const res = await axios.get(`${apiUrl}/api/neo`, {
        params: { start_date: startDate, end_date: endDate }
      });
      // Flatten NEOs by date
      const allNeos = Object.values(res.data.near_earth_objects || {}).flat();
      setNeos(allNeos);
    } catch (err) {
      setError('Failed to fetch NEO data.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for chart: NEO count per day
  const chartData = (() => {
    if (!neos.length) return [];
    const counts = {};
    neos.forEach(neo => {
      const date = neo.close_approach_data[0]?.close_approach_date;
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  })();

  return (
    <div
      style={{
        marginTop: 40,
        padding: '0 2vw',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: 900,
        marginLeft: 'auto',
        marginRight: 'auto',
        // Remove any border
        border: 'none',
        backgroundClip: 'padding-box',
      }}
    >
      <h2
        style={{
          color: '#ffd700',
          marginBottom: 16,
          fontSize: 'clamp(1.2rem, 4vw, 2rem)',
          textAlign: 'center',
        }}
      >
        Near Earth Objects (NEO) Chart
      </h2>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
          justifyContent: 'center',
        }}
      >
        <label htmlFor="neo-start" style={{ minWidth: 80 }}>Start Date: </label>
        <input
          id="neo-start"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          aria-label="NEO start date"
          style={{
            background: '#23243a',
            color: '#fff',
            border: '1px solid #888',
            borderRadius: 4,
            padding: '2px 8px',
            minWidth: 120,
            fontSize: '1rem',
          }}
        />
        <label htmlFor="neo-end" style={{ minWidth: 80 }}>End Date: </label>
        <input
          id="neo-end"
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          aria-label="NEO end date"
          style={{
            background: '#23243a',
            color: '#fff',
            border: '1px solid #888',
            borderRadius: 4,
            padding: '2px 8px',
            minWidth: 120,
            fontSize: '1rem',
          }}
        />
        <button
          onClick={fetchNeos}
          aria-label="Fetch NEOs"
          style={{
            background: '#ffd700',
            color: '#23243a',
            border: 'none',
            borderRadius: 4,
            padding: '4px 12px',
            fontWeight: 600,
            fontSize: '1rem',
            marginTop: 8,
            minWidth: 120,
          }}
        >
          Fetch NEOs
        </button>
      </div>
      {loading && (
        <div style={{ textAlign: 'center', margin: '1rem' }}>
          <Loader size={36} />
        </div>
      )}
      {error && <p style={{ color: 'salmon', textAlign: 'center' }}>{error}</p>}
      {chartData.length > 0 && (
        <div
          style={{
            width: '100%',
            maxWidth: 600,
            margin: '0 auto',
            background: '#23243a',
            borderRadius: 8,
            padding: '2vw',
            boxSizing: 'border-box',
            minWidth: 0,
          }}
        >
          <h4 style={{ color: '#ffd700', textAlign: 'center', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)' }}>NEOs per Day</h4>
          <ResponsiveContainer width="100%" height={window.innerWidth < 600 ? 180 : 250}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={window.innerWidth < 600 ? 10 : 12} />
              <YAxis allowDecimals={false} fontSize={window.innerWidth < 600 ? 10 : 12} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default NeoChart;
