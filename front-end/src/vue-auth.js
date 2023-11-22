// vue-auth.js

export function getAuthToken() {
    return localStorage.getItem('authToken');
}
