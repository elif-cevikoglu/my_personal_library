import axios from 'axios';

const API = axios.create({
  baseURL: 'https://independent-wonder-production-4e75.up.railway.app', // change to your backend URL if deployed
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Token ${token}`;
  }
  return req;
});

export default API;
