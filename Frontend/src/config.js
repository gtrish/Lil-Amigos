// The one place that knows where the backend lives.
// Local: falls back to the Flask dev server.
// Deployed: set VITE_API_URL (e.g. https://lilamigos-api.onrender.com) in the frontend's environment.
export const API = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001').replace(/\/$/, '');
