// api.js

import axios from 'axios';
import { getAuthToken } from '../vue-auth.js';

const instance = axios.create({
    baseURL: 'http://localhost:8008', // Your API base URL
});

instance.interceptors.request.use((config) => {
    const authToken = getAuthToken();

    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
});

export default instance;
