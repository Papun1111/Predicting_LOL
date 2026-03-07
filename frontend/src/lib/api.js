import axios from 'axios';

// Hard-coded Backend URL
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor: Manually injects the JWT token for protected routes
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('user');
  
  if (userData) {
    try {
      const { token } = JSON.parse(userData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Auth Token Parse Error:", error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;