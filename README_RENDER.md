# NASA Data Explorer - Render Deployment Guide

## Frontend (React)
- Make sure your frontend is in the `frontend/` directory.
- Add your NASA API URL to `frontend/.env`:
  ```
  REACT_APP_API_URL=https://your-backend-service.onrender.com
  ```
- Build command: `npm run build`
- Start command: `serve -s build` (Render uses this by default for static sites)
- Add `static.json` for SPA routing (already included).

## Backend (Node.js/Express)
- Make sure your backend is in the `backend/` directory.
- Add your NASA and OpenAI API keys to `backend/.env`:
  ```
  NASA_API_KEY=YOUR_NASA_KEY
  OPENAI_API_KEY=YOUR_OPENAI_KEY
  PORT=10000
  ```
- Start command: `node index.js` or `npm start` (if you have a start script)

## Render Setup
1. Create two new Web Services on Render:
   - One for the backend (Node.js/Express)
   - One for the frontend (Static Site)
2. Set environment variables in the Render dashboard for each service.
3. For the frontend, set the build and start commands as above.
4. For the backend, set the start command and environment variables.
5. Make sure CORS is enabled in your backend (already handled).

## Optional: render.yaml (for one-click deploy)
You can add a `render.yaml` for infrastructure-as-code deployment if desired.

---

For more details, see https://render.com/docs/deploy-create-react-app and https://render.com/docs/deploy-node-express-app
