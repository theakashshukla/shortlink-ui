import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // replace with your backend URL
});

export default api;