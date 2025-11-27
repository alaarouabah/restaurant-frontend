import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export const setAuthHeader = (username, password) => {
  const credentials = btoa(`${username}:${password}`);
  api.defaults.headers.common['Authorization'] = `Basic ${credentials}`;
  localStorage.setItem('auth', credentials);
};

export const clearAuthHeader = () => {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('auth');
};

export const isAuthenticated = () => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    api.defaults.headers.common['Authorization'] = `Basic ${auth}`;
    return true;
  }
  return false;
};

// Initialize auth on load
isAuthenticated();

export default api;
