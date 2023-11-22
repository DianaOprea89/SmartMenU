<template>
  <div class="container">
    <div class="content">
      <div>
        <p>"Introducing our Smart Order Menu app – your ultimate dining companion! Say goodbye to traditional menus and hello to a seamless dining experience. Browse our extensive menu with vibrant visuals, customize your orders effortlessly, and enjoy swift, contactless ordering and payment. Whether you're dining in, ordering takeout, or having food delivered, our app makes every meal a breeze. Elevate your dining experience with convenience and precision – download the Smart Order Menu app today and savor the future of dining!"</p>
      </div>
      <div>
        <router-link to="/addrestaurant" v-slot="{ navigate }">
          <button class="btn btn-primary mb-4" @click="navigate">Add a Restaurant</button>
        </router-link>
      </div>
      <div>
        <h1 class="text-center mb-4">Your Restaurants</h1>
      </div>
      <div class="row" v-if="restaurants">
        <div class="col-md-4" v-for="restaurant in restaurants" :key="restaurant._id.$oid">
          <div class="card">
            <router-link
                :to="{ name: 'Profile' }"
                class="nolink"
                :key="restaurant._id"
            >
            <img :src="restaurant.logoImage" class="card-img-top fixed-size-img" alt="Restaurant">
              <div class="card-body">
                <h5 class="card-title">{{ restaurant.name }}</h5>
                <p class="card-text">{{ restaurant.aboutUs }}</p>
                <p class="card-text">{{ restaurant.address }}</p>
                <p class="card-text">{{ restaurant.phoneNumber }}</p>
                <div>
                  <router-link :to="'/restaurant/'+ restaurant.name" >
                    <button class="btn btn-secondary btn-sm mr-2">More Info</button>
                  </router-link>
                  <button class="btn btn-danger btn-sm" @click="removeRestaurant(restaurant._id)">Remove</button>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import { mapGetters } from 'vuex';
import {getAuthToken} from "../utility/utility.js"
export default {
  name: "ProfilePage",
  computed: {
    restaurants() {
      return this.$store.state.user.restaurants;
    },
    ...mapGetters(['getUserId'])
  },
  methods: {
    async removeRestaurant(restaurantId) {
      console.log('Clicked "Remove" button for restaurant with ID:', restaurantId);
      try {
        const userId = this.$store.getters.getUserId;
        console.log('Removing restaurant with ID:', restaurantId);
        const apiUrl = `/api/removeRestaurant/${userId}/${restaurantId}`;
        console.log('Deleting restaurant with URL:', apiUrl);

        const authToken = getAuthToken();

        console.log('Authorization Token:', authToken);
        const response = await api.delete(apiUrl);

        if (response && response.status === 200) {
          this.$store.commit('removeRestaurant', restaurantId);
          console.log('Restaurant removed successfully');
        } else {
          console.error('Error removing restaurant. Status:', response ? response.status : 'Unknown');
          // Handle other response statuses as needed
        }

        // Fetch updated restaurant data (if needed)
        const updatedResponse = await api.get(`/api/getRestaurants`);
        if (updatedResponse && updatedResponse.status === 200) {
          this.$store.commit('SET_RESTAURANTS', updatedResponse.data);
        } else {
          console.error('Error fetching updated restaurant data. Status:', updatedResponse ? updatedResponse.status : 'Unknown');
          // Handle other response statuses as needed
        }
      } catch (error) {
        console.error('An error occurred while removing restaurant:', error);

        if (error.response) {
          console.error('Response Status:', error.response.status);
          console.error('Response Data:', error.response.data);
        }
        // Handle other errors as needed
      }
    },



  },
  created() {

    const loadUserDataPromise = this.$store.dispatch('loadUserData');
    const fetchRestaurantsPromise = this.$store.dispatch('fetchRestaurants');

    Promise.all([loadUserDataPromise, fetchRestaurantsPromise])
        .then(() => {
          console.log('User data and restaurants loaded successfully');
        })
        .catch((error) => {
          console.error('Error loading user data or restaurants:', error);
        });
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  flex-direction: row;
  height: 100vh;
}

.fixed-size-img {
  width: 150px; /* Set the desired width */
  height: 150px; /* Set the desired height */
}

.nolink {
  text-decoration: none;
  color: black;
}

.content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column; /* Set to column to stack elements vertically */
}

/* Style for individual cards */
.card {
  flex: 0 0 calc(33.3333% - 20px); /* Adjust the width as needed */
  margin-right: 20px; /* Add spacing between cards */
  margin-bottom: 20px; /* Add spacing between rows */
}

.card-img-top {
  max-width: 100%;
  height: auto;
}

/* Optional: To ensure consistent card heights */
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>
