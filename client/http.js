import axios from 'axios';

// For theme colors, use relative paths (local server) - for user data, use external API
const themeBaseURL = ''; // Relative paths - uses same origin (local server)
const userDataBaseURL = import.meta.env.VITE_GEMTN_HOST || 'http://localhost:4000';
console.log('GEMTN_HOST from env:', import.meta.env.VITE_GEMTN_HOST);
console.log('Using theme baseURL (local):', themeBaseURL);
console.log('Using user data baseURL:', userDataBaseURL);

// HTTP client for theme colors (uses local server endpoints)
const http = axios.create({
  baseURL: themeBaseURL,
  timeout: 10000,
});

// HTTP client for user data (uses external API)
const userHttp = axios.create({
  baseURL: userDataBaseURL,
  timeout: 10000,
});

// Export both - default http for theme colors, userHttp for user data
export default http;
export { userHttp };
