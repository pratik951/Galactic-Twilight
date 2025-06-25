import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

app.use(cors());

// Cache middleware
function cacheMiddleware(keyBuilder) {
  return (req, res, next) => {
    const key = keyBuilder(req);
    const cached = cache.get(key);
    if (cached) return res.json(cached);
    res.sendJson = res.json;
    res.json = (data) => {
      cache.set(key, data);
      res.sendJson(data);
    };
    next();
  };
}

// Example endpoint: Astronomy Picture of the Day
app.get('/api/apod', cacheMiddleware(() => 'apod'), async (req, res) => {
  try {
    const response = await axios.get('https://api.nasa.gov/planetary/apod', {
      params: { api_key: NASA_API_KEY, ...req.query }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch APOD data.' });
  }
});

// Mars Rover Photos endpoint
app.get('/api/mars-photos', cacheMiddleware(req => `mars-${JSON.stringify(req.query)}`), async (req, res) => {
  try {
    const { rover = 'curiosity', earth_date = '', camera = '' } = req.query;
    const params = { api_key: NASA_API_KEY };
    if (earth_date) params.earth_date = earth_date;
    if (camera) params.camera = camera;
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`;
    const response = await axios.get(url, { params });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Mars Rover photos.' });
  }
});

// AI Caption Generator (OpenAI integration ready)
app.post('/api/ai-caption', express.json(), async (req, res) => {
  const { title, explanation } = req.body;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    // Fallback to mock if no key
    const mockCaption = `"${title}" — A cosmic wonder! Here’s a poetic take: ${explanation.slice(0, 80)}...`;
    return res.json({ caption: mockCaption });
  }
  try {
    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a poetic space expert.' },
          { role: 'user', content: `Write a creative, educational, or poetic caption for this NASA image: ${title}. Description: ${explanation}` }
        ],
        max_tokens: 60
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const caption = openaiRes.data.choices[0].message.content;
    res.json({ caption });
  } catch (error) {
  console.error('OpenAI error:', error.response?.data || error.message || error);
  res.status(500).json({ error: 'Failed to generate AI caption.' });
 }
});

// EPIC (Earth Polychromatic Imaging Camera) endpoint
app.get('/api/epic', cacheMiddleware(req => `epic-${JSON.stringify(req.query)}`), async (req, res) => {
  try {
    const { date = '' } = req.query;
    // If no date, get most recent natural images
    const url = date
      ? `https://api.nasa.gov/EPIC/api/natural/date/${date}`
      : 'https://api.nasa.gov/EPIC/api/natural/images';
    const response = await axios.get(url, { params: { api_key: NASA_API_KEY } });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch EPIC data.' });
  }
});

// NeoWs (Near Earth Object Web Service) endpoint
app.get('/api/neo', cacheMiddleware(req => `neo-${JSON.stringify(req.query)}`), async (req, res) => {
  try {
    const { start_date = '', end_date = '' } = req.query;
    const params = { api_key: NASA_API_KEY };
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    const url = 'https://api.nasa.gov/neo/rest/v1/feed';
    const response = await axios.get(url, { params });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch NEO data.' });
  }
});

// Ask NASA AI endpoint
app.post('/api/ask-nasa', express.json(), async (req, res) => {
  const { question, context } = req.body;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    // Mock response
    return res.json({ answer: `I'm a demo NASA AI. You asked: "${question}". Here's a fun fact: ${context?.apod?.title || 'The universe is vast and full of wonders!'}` });
  }
  try {
    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful NASA space expert. Use the provided context to answer user questions about NASA data.' },
          { role: 'user', content: `Context: ${JSON.stringify(context)}\nQuestion: ${question}` }
        ],
        max_tokens: 120
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const answer = openaiRes.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate NASA AI answer.' });
  }
});

// SSD/CNEOS endpoint (Orbital Elements for Asteroids)
app.get('/api/ssdcneos', cacheMiddleware(req => `ssdcneos-${JSON.stringify(req.query)}`), async (req, res) => {
  try {
    // Example: fetch orbital elements for a specific asteroid (by SPK-ID or designation)
    const { spkId = '', designation = '' } = req.query;
    let url = 'https://ssd-api.jpl.nasa.gov/sbdb.api';
    const params = {};
    if (spkId) params.spk = spkId;
    if (designation) params.des = designation;
    const response = await axios.get(url, { params });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SSD/CNEOS data.' });
  }
});

app.listen(PORT, () => {
  console.log(`NASA backend server running on port ${PORT}`);
});

export default app;
