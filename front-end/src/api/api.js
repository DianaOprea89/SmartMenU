// src/api.js
import axios from 'axios';
import { getAuthToken } from '@/utility/utility';

const api = axios.create({
    baseURL: 'http://localhost:8013',
    headers: {
        'Content-Type': 'application/json',
    },
});


export default api;
