import axios from "axios";

// With CRA proxy set, we can call relative to the frontend origin
const API = axios.create({
  baseURL: "/api"
});

export const login = (email, password) => API.post('/auth/login', { email, password });
export const signup = (username, email, password) => API.post('/auth/signup', { username, email, password });

// Add token to requests if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
