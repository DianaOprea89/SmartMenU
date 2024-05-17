// src/api.js
import axios from 'axios';
import { getAuthToken } from '@/utility/utility';

const api = axios.create({
    baseURL: 'http://localhost:8013', // or your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add an interceptor to set the Authorization header for all requests
api.interceptors.request.use((config) => {
    const authToken = getAuthToken(); // Make sure getAuthToken() is correctly returning the token
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
