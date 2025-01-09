//Configures the Axios instance to communicate with the backend API.

import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:4000', // Backend URL
  headers: {
    'Content-Type': 'application/json', // the header tells the server the format of the data being
    //sent in the request body
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
