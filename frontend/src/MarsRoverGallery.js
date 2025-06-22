import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const rovers = ['curiosity', 'opportunity', 'spirit'];

function MarsRoverGallery() {
  const [rover, setRover] = useState('curiosity');
  const [date, setDate] = useState('2020-07-01');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState('');

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5000/api/mars-photos', {
        params: { rover, earth_date: date }
      });
      setPhotos(res.data.photos || []);
    } catch (err) {
      setError('Failed to fetch Mars Rover photos.');
    } finally {
      setLoading(false);
    }
  };

  // Count photos per camera for chart
  const cameraCounts = photos.reduce((acc, photo) => {
    acc[photo.camera.name] = (acc[photo.camera.name] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(cameraCounts).map(([name, count]) => ({ name, count }));

  const cameras = Array.from(new Set(photos.map(photo => photo.camera.name)));
  const filteredPhotos = selectedCamera ? photos.filter(photo => photo.camera.name === selectedCamera) : photos;

  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={{ color: '#ffd700', marginBottom: 16 }}>Mars Rover Photo Gallery</h2>
      <div style={{ marginBottom: 16, flexWrap: 'wrap', display: 'flex', alignItems: 'center', gap: 12 }}>
        <label>Rover: </label>
        <select value={rover} onChange={e => setRover(e.target.value)} aria-label="Select Mars rover" style={{ background: '#23243a', color: '#fff', border: '1px solid #888', borderRadius: 4, padding: '2px 8px' }}>
          {rovers.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <label>Earth Date: </label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} aria-label="Mars rover earth date" style={{ background: '#23243a', color: '#fff', border: '1px solid #888', borderRadius: 4, padding: '2px 8px' }} />
        <button onClick={fetchPhotos} aria-label="Fetch Mars rover photos" style={{ background: '#ffd700', color: '#23243a', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 600 }}>Fetch Photos</button>
        {cameras.length > 0 && (
          <>
            <label>Camera: </label>
            <select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)} aria-label="Select camera" style={{ background: '#23243a', color: '#fff', border: '1px solid #888', borderRadius: 4, padding: '2px 8px' }}>
              <option value="">All</option>
              {cameras.map(cam => <option key={cam} value={cam}>{cam}</option>)}
            </select>
          </>
        )}
      </div>
      {loading && <Spinner />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {chartData.length > 0 && (
        <div style={{ maxWidth: 500, marginBottom: 24, background: '#23243a', borderRadius: 8, padding: 16 }}>
          <h4 style={{ color: '#ffd700' }}>Photos per Camera</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        {filteredPhotos.map(photo => (
          <div key={photo.id} style={{ width: 200, marginBottom: 16, background: '#23243a', borderRadius: 8, boxShadow: '0 2px 8px #0004', padding: 8 }}>
            <img src={photo.img_src} alt={photo.camera.full_name} style={{ width: '100%', borderRadius: 6, maxHeight: 160, objectFit: 'cover', marginBottom: 6 }} />
            <div style={{ fontSize: 12, color: '#fff' }}>
              <b>{photo.camera.name}</b> ({photo.camera.full_name})<br />
              {photo.earth_date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60 }}>
      <div style={{ border: '4px solid #eee', borderTop: '4px solid #8884d8', borderRadius: '50%', width: 32, height: 32, animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default MarsRoverGallery;
