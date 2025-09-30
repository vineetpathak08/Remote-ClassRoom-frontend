import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add connection type header if available
    if (navigator.connection) {
      config.headers['connection-type'] = navigator.connection.effectiveType;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    }
    return Promise.reject(error);
  }
);

export default api;