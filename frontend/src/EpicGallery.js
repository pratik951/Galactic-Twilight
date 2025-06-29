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

function EpicGallery() {
  const [date, setDate] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const res = await axios.get(`${apiUrl}/api/epic`, {
        params: { date }
      });
      setImages(res.data || []);
    } catch (err) {
      setError('Failed to fetch EPIC images.');
    } finally {
      setLoading(false);
    }
  };

  // NASA EPIC image URL builder
  const getImageUrl = img => {
    const d = img.date.split(' ')[0].replace(/-/g, '/');
    return `https://epic.gsfc.nasa.gov/archive/natural/${d}/jpg/${img.image}.jpg`;
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={{ color: '#ffd700', marginBottom: 16 }}>Earth Polychromatic Imaging Camera (EPIC)</h2>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label htmlFor="epic-date">Date: </label>
        <input id="epic-date" type="date" value={date} onChange={e => setDate(e.target.value)} aria-label="EPIC date" style={{ background: '#23243a', color: '#fff', border: '1px solid #888', borderRadius: 4, padding: '2px 8px' }} />
        <button onClick={fetchImages} aria-label="Fetch EPIC images" style={{ background: '#ffd700', color: '#23243a', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 600 }}>Fetch Images</button>
      </div>
      {loading && (
        <div style={{ textAlign: 'center', margin: '1rem' }}>
          <Loader size={36} />
        </div>
      )}
      {error && <p style={{ color: 'salmon' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        {images.map(img => (
          <div key={img.identifier} style={{ background: '#23243a', borderRadius: 8, boxShadow: '0 2px 8px #0004', padding: 8, width: 240 }}>
            <img src={getImageUrl(img)} alt={img.caption} style={{ width: '100%', borderRadius: 6, maxHeight: 160, objectFit: 'cover', marginBottom: 6 }} />
            <div style={{ fontSize: 12, color: '#fff' }}>
              <b>{img.caption}</b><br />
              {img.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EpicGallery;
