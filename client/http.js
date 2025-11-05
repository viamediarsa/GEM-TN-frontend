import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
console.log('API URL from env:', import.meta.env.VITE_API_URL);
console.log('Using baseURL:', baseURL);

const http = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

export default http;
