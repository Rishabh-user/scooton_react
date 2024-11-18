import axios from 'axios';

export const BASE_URL = 'https://scooton-api-dev.el.r.appspot.com';

// Add request interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwtToken'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

