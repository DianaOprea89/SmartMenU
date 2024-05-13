// utility.js
export function getAuthToken() {
    const token = localStorage.getItem('jwtToken');
    console.log('jwtToken:', token); // Log the token value
    return token; // Return the token
}
