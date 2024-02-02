<template>
  <div class="container">
    <div class="m-2 icon-container">
      <router-link :to="`/restaurant/${encodeURIComponent(restaurantName)}/accessRestaurant`" class="go-back d-flex justify-content-end ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle m-1" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
        </svg>
      </router-link>
    </div>
    <div class="m-5">
      <h1 class="restaurant-title align-content-center" >Menu options for: <strong>{{ restaurantName }}</strong></h1>
    </div>
    <div v-if="restaurant" class="menu-options-container">
          <div v-for="menuOption in restaurant.menuOptions" :key="menuOption._id" class="m-1">
            <img :src="menuOption.photoLink" alt="Meal image" class="meal-image">
            <button class="btn btn-secondary m-1" >{{ menuOption.optionName }} </button>
          </div>
    </div>
    <div v-else>
      <p>Loading menu options...</p>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";

export default {
  name: "ViewRestaurantsMenu",
  props: {
    restaurantName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      restaurant: null, // Define the restaurant property
    }
  },
  methods: {
    async fetchRestaurant() {
      try {
        // Assuming '/api/userData' endpoint returns an array of restaurants
        const response = await api.get('/api/userData');

        if (response && response.status === 200) {
          // Find the restaurant by name
          const matchingRestaurant = response.data.restaurants.find(r => r.name === this.restaurantName);
          this.restaurant = matchingRestaurant || null;
        } else {
          console.error('Failed to fetch restaurants. Status:', response ? response.status : 'Unknown');
        }
      } catch (error) {
        console.error('An error occurred while fetching the restaurant:', error);
      }
    },
  },
  created() {
    this.fetchRestaurant(); // Fetch the specific restaurant when the component is created
  },
}
</script>

<style scoped>
.restaurant-title{
  font-size: 1.5rem;
}
ul {
  padding-left: 0; /* Removes padding from the ul */
  list-style-type: none; /* Removes the bullets */
}

li {
  margin: 0; /* Removes margin from li */
  padding: 0; /* Removes padding from li */
  /* Add any additional resets you require */
}
.meal-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}
.go-back {
  display: inline-flex; /* Use inline-flex to keep the button inline */
  align-items: center; /* Align the text and icon vertically */
  padding: 5px 10px; /* Padding around the text and icon */
  color: black;
  text-decoration: none;
  transition: background-color 0.3s, border-color 0.3s; /* Transition for hover effects */
}

.go-back:hover {
  background-color: #e6e6e6; /* Slightly darker background on hover */
  border-color: #b3b3b3; /* Darker border on hover */
  text-decoration: none; /* No underline on hover */
}

.go-back svg {
  margin-left: 5px; /* Small space between text and icon */
}
.menu-options-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* creates three columns */
  gap: 20px; /* adds space between the columns */
}
</style>