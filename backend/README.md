# NASA Data Explorer Backend

This is the Node.js + Express backend for the NASA Data Explorer project.

## Available Scripts

- `npm install` — Install dependencies
- `npm start` — Start the server
- `npm run dev` — Start the server with nodemon (auto-restart on changes)

## Environment Variables

- `NASA_API_KEY` — Your NASA API key (default: DEMO_KEY)
- `PORT` — Port to run the server (default: 5000)

## Features
- Proxies requests to NASA's Open APIs (e.g., APOD)
- Handles CORS for frontend communication
- Error handling for failed API requests

## Setup
1. Run `npm install` to install dependencies.
2. Create a `.env` file (see `.env` example).
3. Run `npm start` or `npm run dev` to launch the server.
