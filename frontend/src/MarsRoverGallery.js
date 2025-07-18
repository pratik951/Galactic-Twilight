import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { getDefaultDateForRover, getValidDatesForRover } from './roverDateUtils';
import RoverMissionTimeline from './RoverMissionTimeline';
import RoverStoryTimeline from './RoverStoryTimeline';
import { roverMilestones } from './roverMilestones';
import { roverStories } from './roverStories';

const rovers = ['curiosity', 'opportunity', 'spirit'];

function MarsRoverGallery({ onMissionNotify }) {
  const [rover, setRover] = useState('curiosity');
  const [date, setDate] = useState(getDefaultDateForRover('curiosity'));
  // Update date to valid default when rover changes
  useEffect(() => {
    setDate(getDefaultDateForRover(rover));
  }, [rover]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState('');

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const res = await axios.get(`${apiUrl}/api/mars-photos`, {
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
  // Patch img_src to use https for NASA images
  const patchImgSrc = url => {
    if (typeof url === 'string' && url.startsWith('http://mars.nasa.gov/')) {
      return url.replace('http://', 'https://');
    }
    return url;
  };

  const filteredPhotos = selectedCamera ? photos.filter(photo => photo.camera.name === selectedCamera) : photos;

  // For Opportunity and Spirit, show the story timeline and story card
  const showStoryTimeline = rover === 'opportunity' || rover === 'spirit';
  const stories = showStoryTimeline ? roverStories[rover] : [];
  const selectedStory = stories.find(story => story.date === date) || stories[0];

  // Only show images for Curiosity
  const showImages = rover === 'curiosity';

  // Only show fetch button for Curiosity
  const showFetchButton = rover === 'curiosity';

  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={{ color: '#ffd700', marginBottom: 16 }}>Mars Rover Photo Gallery</h2>
      {/* Mission Timeline for Opportunity and Spirit */}
      {showStoryTimeline && (
        <>
          <RoverStoryTimeline
            stories={stories}
            selectedDate={date}
            onDateSelect={d => {
              setDate(d);
              const story = stories.find(s => s.date === d);
              if (story) {
                // Only notify on mission events, not on date selection
                if (story.mission_event) {
                  onMissionNotify({
                    title: story.title,
                    description: story.description,
                    date: story.date
                  });
                }
              }
            }}
          />
          {selectedStory && (
            <div className="rover-story-card" style={{background:'#23243a',color:'#fff',borderRadius:8,padding:20,marginBottom:20,maxWidth:600,marginLeft:'auto',marginRight:'auto',boxShadow:'0 2px 8px #0004'}}>
              <h3 style={{color:'#ffd700',marginBottom:8}}>{selectedStory.title}</h3>
              <div style={{fontSize:14,marginBottom:8}}><b>Date:</b> {selectedStory.date}</div>
              <div style={{fontSize:16,marginBottom:8}}>{selectedStory.description}</div>
              <blockquote style={{fontStyle:'italic',color:'#ffd700',borderLeft:'4px solid #ffd700',paddingLeft:12,margin:0}}>{selectedStory.quote}</blockquote>
            </div>
          )}
        </>
      )}
      <div style={{ marginBottom: 16, flexWrap: 'wrap', display: 'flex', alignItems: 'center', gap: 12 }}>
        <label>Rover: </label>
        <select value={rover} onChange={e => setRover(e.target.value)} aria-label="Select Mars rover" style={{ background: '#23243a', color: '#fff', border: '1px solid #888', borderRadius: 4, padding: '2px 8px' }}>
          {rovers.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <label>Earth Date: </label>
        <input
          type="date"
          value={date}
          min={getValidDatesForRover(rover)[0]}
          max={getValidDatesForRover(rover).slice(-1)[0]}
          onChange={e => setDate(e.target.value)}
          aria-label="Mars rover earth date"
          style={{ background: '#23243a', color: '#fff', border: '1px solid #888', borderRadius: 4, padding: '2px 8px' }}
          list="valid-dates"
        />
        {/* Optionally, provide a datalist for valid dates for better UX */}
        <datalist id="valid-dates">
          {getValidDatesForRover(rover).map(d => (
            <option key={d} value={d} />
          ))}
        </datalist>
        {showFetchButton && (
          <button onClick={fetchPhotos} aria-label="Fetch Mars rover photos" style={{ background: '#ffd700', color: '#23243a', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 600 }}>Fetch Photos</button>
        )}
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
      {showImages && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {filteredPhotos.map(photo => (
            <div key={photo.id} style={{ width: 200, marginBottom: 16, background: '#23243a', borderRadius: 8, boxShadow: '0 2px 8px #0004', padding: 8 }}>
              <img src={patchImgSrc(photo.img_src)} alt={photo.camera.full_name} style={{ width: '100%', borderRadius: 6, maxHeight: 160, objectFit: 'cover', marginBottom: 6 }} />
              <div style={{ fontSize: 12, color: '#fff' }}>
                <b>{photo.camera.name}</b> ({photo.camera.full_name})<br />
                {photo.earth_date}
              </div>
            </div>
          ))}
        </div>
      )}
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
