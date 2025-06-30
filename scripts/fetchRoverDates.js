// Script to fetch and print all available dates for Opportunity and Spirit rovers
// Usage: node scripts/fetchRoverDates.js

const axios = require('axios');
const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const rovers = ['opportunity', 'spirit'];

async function fetchManifest(rover) {
  const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}`;
  const res = await axios.get(url, { params: { api_key: API_KEY } });
  return res.data.photo_manifest.photos.map(p => p.earth_date);
}

(async () => {
  for (const rover of rovers) {
    try {
      const dates = await fetchManifest(rover);
      console.log(`\n${rover.toUpperCase()} has photos on ${dates.length} dates:`);
      console.log(dates.join(", "));
    } catch (e) {
      console.error(`Failed for ${rover}:`, e.message);
    }
  }
})();
