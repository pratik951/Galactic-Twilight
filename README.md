# NASA Data Explorer

A web application to explore and visualize NASA's open data using React (frontend) and Node.js/Express (backend).

## Project Structure

```
├── frontend/   # React app
├── backend/    # Node.js + Express server
└── README.md   # Project overview and setup instructions
```

## Features
- Astronomy Picture of the Day (APOD) viewer
- Mars Rover Photo Gallery with camera filter and chart visualization
- Real-time updates using WebSocket for Mars Rover photos
- Notifications dropdown in the Navbar for real-time updates
- Efficient state management with lazy-loaded WebSocket connections
- Responsive, modern UI
- Error handling and loading states
- Easy to extend with more NASA APIs

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Setup

#### 1. Backend
```
cd backend
npm install
```
- Create a `.env` file (see `.env` example) and set your NASA API key (or use `DEMO_KEY`).
- Start the server:
```
npm run dev
```

#### 2. Frontend
```
cd frontend
npm install
npm start
```
- The app will open at `http://localhost:3000` (default).

## Usage
- View the Astronomy Picture of the Day on load.
- Explore Mars Rover photos by selecting rover, date, and camera.
- Visualize photo counts per camera with a bar chart.
- Receive real-time updates via the Notifications dropdown in the Navbar.

## Testing

### Backend
- Uses Jest and Supertest for API endpoint testing.
- Example: `cd backend && npm install --save-dev jest supertest && npx jest`

### Frontend
- Uses React Testing Library and Jest.
- Example: `cd frontend && npm test`

## Deployment
- Deploy backend (e.g., Render, Heroku) and frontend (e.g., Vercel, Netlify).
- Update API URLs in `.env` files as needed for production.

## Bonus Features
- Camera filter and chart for Mars Rover photos
- Responsive design
- Loading spinners for better UX
- Basic automated tests for backend and frontend
- Notifications auto-minimize after 7.5 seconds
- Notifications list limited to the latest 10 entries

## Important Note on API Keys

When integrating the `OPENAI_API_KEY`, always run the following command to clear any previously cached API keys:

```cmd
cd backend 
SET OPENAI_API_KEY=
```

This ensures that the application uses the correct API key during execution.

## License
This project is for educational/demo purposes only.
