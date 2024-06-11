// utility.js
export function getAuthToken() {
    return localStorage.getItem('jwtToken'); // Adjust to your storage method
}