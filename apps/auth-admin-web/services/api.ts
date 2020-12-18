import axios from 'axios';

const instance = axios.create({
  // baseURL: process.env.BACKEND_URL, // This should work according to docs, but doesn't
  baseURL: 'http://localhost:4200/api/',
  responseType: 'json',
});

export default instance;
