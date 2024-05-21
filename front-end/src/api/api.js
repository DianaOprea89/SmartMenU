// src/api.js
import axios from 'axios';
import { getAuthToken } from '@/utility/utility';

const api = axios.create({
    baseURL: 'http://localhost:8013',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add an interceptor to set the Authorization header for all requests
api.interceptors.request.use(
    (config) => {
        const authToken = getAuthToken();
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized error:', error.response);
            // Handle unauthorized error (e.g., redirect to login)
        }
        return Promise.reject(error);
    }
);

export default api;
