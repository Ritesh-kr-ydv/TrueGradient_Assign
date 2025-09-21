import axios from 'axios';

//const API_URL = 'http://localhost:5001/api/auth';
const API_URI='http://localhost:5001/api/auth'


// Create axios instance
const api = axios.create({
  baseURL: API_URI,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const authService = {
  register: (userData) => {
    console.log('Making register API call with:', userData);
    return api.post('/register', userData);
  },
  login: (userData) => {
    console.log('Making login API call with:', userData);
    return api.post('/login', userData);
  },
  getProfile: () => {
    console.log('Making getProfile API call');
    return api.get('/profile');
  },
};

export default authService;
