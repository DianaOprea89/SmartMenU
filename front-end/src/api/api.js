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
        if (authToken.Authorization) {
            config.headers.Authorization = authToken.Authorization;
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
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized error (e.g., redirect to login, log out user)
                    console.error('Unauthorized error:', error.response);
                    break;
                case 404:
                    console.error('Resource not found:', error.response);
                    break;
                default:
                    console.error('Error response:', error.response);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
