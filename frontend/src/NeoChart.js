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
    <div style={{ marginTop: 40 }}>
      <h2 style={{ color: '#ffd700', marginBottom: 16 }}>Near Earth Objects (NEO) Chart</h2>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label htmlFor="neo-start">Start Date: </label>
        <input id="neo-start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} aria-label="NEO start date" style={{ background: '#23243a', color: '#fff', border: '1px solid #888', borderRadius: 4, padding: '2px 8px' }} />
        <label htmlFor="neo-end">End Date: </label>
        <input id="neo-end" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} aria-label="NEO end date" style={{ background: '#23243a', color: '#fff', border: '1px solid #888', borderRadius: 4, padding: '2px 8px' }} />
        <button onClick={fetchNeos} aria-label="Fetch NEOs" style={{ background: '#ffd700', color: '#23243a', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 600 }}>Fetch NEOs</button>
      </div>
      {loading && (
        <div style={{ textAlign: 'center', margin: '1rem' }}>
          <Loader size={36} />
        </div>
      )}
      {error && <p style={{ color: 'salmon' }}>{error}</p>}
      {chartData.length > 0 && (
        <div style={{ maxWidth: 600, margin: '0 auto', background: '#23243a', borderRadius: 8, padding: 16 }}>
          <h4 style={{ color: '#ffd700' }}>NEOs per Day</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
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
