// utility.js
export function getAuthToken() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
}
