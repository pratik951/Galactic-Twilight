import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import { WebSocketServer } from 'ws';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

app.use(cors());

// Function to dynamically fetch the OpenAI API key
function getOpenAIKey() {
  dotenv.config(); // Reload .env file to ensure the latest key is fetched
  return process.env.OPENAI_API_KEY;
}

// Update the logging to hide the OpenAI API key
console.log('Using OpenAI API Key: [HIDDEN]');

// Clear the OpenAI API key from the cache
cache.del('OPENAI_API_KEY');
console.log('Cleared OpenAI API Key from cache.');

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

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'NASA Backend API is running' });
});

// Example endpoint: Astronomy Picture of the Day
// Update the APOD endpoint to ensure it fetches and returns the data correctly
app.get('/api/apod', cacheMiddleware(() => 'apod'), async (req, res) => {
  try {
    const response = await axios.get('https://api.nasa.gov/planetary/apod', {
      params: { api_key: NASA_API_KEY, ...req.query }
    });
    if (!response.data) {
      return res.status(404).json({ error: 'No APOD data found.' });
    }
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching APOD data:', error.message || error);
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
  const OPENAI_API_KEY = getOpenAIKey(); // Dynamically fetch the key
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
  const OPENAI_API_KEY = getOpenAIKey(); // Dynamically fetch the key
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

// Create a WebSocket server
const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established.');

  // Send periodic updates (example: Mars Rover photos)
  const interval = setInterval(() => {
    const update = {
      type: 'mars-photos-update',
      message: 'New Mars Rover photos available!',
      timestamp: new Date().toISOString(),
    };
    ws.send(JSON.stringify(update));
  }, 10000); // Send updates every 10 seconds

  // Clean up on connection close
  ws.on('close', () => {
    clearInterval(interval);
    console.log('WebSocket connection closed.');
  });
});

// Integrate WebSocket server with Express
app.server = app.listen(PORT, () => {
  console.log(`NASA backend server running on port ${PORT}`);
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

export default app;
