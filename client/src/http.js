import axios from 'axios';

const http = axios.create({
  baseURL: process.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

http.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios error:', error.message);
    return Promise.reject(error);
  }
);

export default http;
