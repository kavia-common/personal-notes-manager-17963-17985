Environment configuration

At runtime, the frontend reads window.__env.API_BASE_URL from /public/env.js (served as /env.js) to know where the notes backend is.

- Set window.__env.API_BASE_URL to your backend URL (e.g., 'http://localhost:8080').
- If not set, the app defaults to '/api'.

Example env.js:
(function (window) {
  window.__env = window.__env || {};
  window.__env.API_BASE_URL = 'http://localhost:8080';
})(this);

Do not commit secrets. This file is served as-is and can be replaced by deployment.
