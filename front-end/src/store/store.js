import {createStore} from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import api from "@/api/api";

export default createStore({
    plugins: [createPersistedState()],
    state: {
        user: {
            email: localStorage.getItem('userEmail') || '',
            name: localStorage.getItem('userName') || '',
            id: localStorage.getItem('userId') || '',
            restaurants: [],
            token: localStorage.getItem('jwtToken') || '', // Use 'jwtToken' to match what's used in your code
        },
    },
    mutations: {
        setUser(state, payload) {
            console.log('Committing user data', payload);
            state.user.email = payload.email;
            state.user.name = payload.name;
            state.user.id = payload.id;
            state.user.restaurants = payload.restaurants || [];
            if (payload.token) {
                state.user.token = payload.token;
                localStorage.setItem('jwtToken', payload.token); // Update local storage
            }
        },
        clearUserData(state) {
            state.user.email = '';
            state.user.name = '';
            state.user.id = '';
            state.user.token = ''; // Clear the token
            localStorage.removeItem('jwtToken');
        },
        SET_RESTAURANTS(state, restaurants) {
            state.user.restaurants = restaurants;
        },
        removeRestaurant(state, restaurantId) {
            // Remove the restaurant with the specified ID from the user's restaurants array
            state.user.restaurants = state.user.restaurants.filter(restaurant => restaurant._id !== restaurantId);
        },
        removeMenuItem(state, { restaurantId, menuOptionId }) {
            const restaurant = state.user.restaurants.find(r => r._id === restaurantId);
            if (restaurant) {
                restaurant.menuOptions = restaurant.menuOptions.filter(option => option._id !== menuOptionId);
                // Vue.set(restaurant, 'menuOptions', newMenuOptions); // Use Vue.set if you need to ensure reactivity
            }
        },
    },
    getters: {
        isAuthenticated: (state) => {
            return !!state.user.email;
        },
        getName: (state) => {
            return state.user.name;
        },
        yourIsAuthenticatedGetter: (state) => {
            return !!state.user.token; // Update to use 'token'
        },
        yourUserIdGetter: (state) => {
            return state.user.id;
        },
        getUserId: (state) => state.user.id,
        userEmail: (state) => state.user.email,
        restaurants: (state) => state.user.restaurants,
    },
    actions: {
        async loadUserData({commit}) {
            try {
                const token = localStorage.getItem('jwtToken'); // Use 'jwtToken' to match what's used in your code
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await fetch('http://localhost:8008/api/userData', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error('Failed to fetch user data. Status:', response.status);
                    console.error('Response Text:', await response.text());

                    // Handle specific error statuses (e.g., unauthorized)
                    if (response.status === 401) {
                        // Clear user data in case of unauthorized access
                        commit('clearUserData');
                    }

                    throw new Error('Failed to fetch user data');
                }
                const fullUserData = await response.json();

                console.log('User data from response', fullUserData);

                commit('setUser', { // Update to pass 'token' if needed
                    email: fullUserData.email,
                    name: fullUserData.name,
                    id: fullUserData.id,
                    restaurants: fullUserData.restaurants,
                    token: token, // Update to use 'token' from local storage
                });
                console.log('State after commit:', this.state.user);
            } catch (error) {
                console.error('Error during loadUserData:', error);
                console.error('Failed to load user data:', error);
                // Handle the error here, such as showing an error message to the user
            }
        },
        async login({commit}, credentials) {
            try {
                // Replace with your actual login API call
                const response = await api.post('/api/login', credentials);

                if (response.data.token) {
                    localStorage.setItem('jwtToken', response.data.token);
                    commit('setUser', {
                        email: response.data.user.email,
                        name: response.data.user.name,
                        id: response.data.user.id,
                        token: response.data.token, // Update to use 'token'
                    });
                    console.log('User logged in:', this.state.user);
                } else {
                    throw new Error('Login failed');
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        },
        async fetchRestaurants({commit}) {
            try {
                const token = localStorage.getItem('jwtToken');
                const result = await api.get('/api/getRestaurants', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                const restaurants = result.data;


                commit('SET_RESTAURANTS', restaurants);
            } catch (error) {
                console.error('An error occurred while fetching restaurants:', error);
            }
        },
    },
});
