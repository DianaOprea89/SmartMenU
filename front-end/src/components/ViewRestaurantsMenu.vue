<template>
  <div class="container">
    <div class="m-2 icon-container">
      <router-link :to="`/restaurant/${encodeURIComponent(restaurantName)}/accessRestaurant`"
                   class="go-back d-flex justify-content-end ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
             class="bi bi-arrow-left-circle m-1" viewBox="0 0 16 16">
          <path fill-rule="evenodd"
                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
        </svg>
      </router-link>
    </div>
    <div class="m-5">
      <h1 class="restaurant-title align-content-center"><strong>{{ restaurantName }}</strong></h1>
    </div>
    <div v-if="restaurant" class="menu-options-container ">
      <div class="each-option search-option" @click="toggleSearchBar">
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-search"
             viewBox="0 0 16 16">
          <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </svg>
      </div>
      <input v-if="showSearchBar" type="text" placeholder="Search..." class="search-input"/>
      <div class="each-option">
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-funnel-fill"
             viewBox="0 0 16 16">
          <path
              d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"/>
        </svg>

    </div>
    <div v-for="menuOption in restaurant.menuOptions" :key="menuOption._id" class="m-1 each-option">
      <img :src="menuOption.photoLink" alt="Meal image" class="meal-image">
      <span>{{ menuOption.optionName }} </span>
    </div>
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
      restaurant: null,
      showSearchBar: false,
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
    toggleSearchBar() {
      this.showSearchBar = !this.showSearchBar;
    },
  },
  created() {
    this.fetchRestaurant(); // Fetch the specific restaurant when the component is created
  },
}
</script>

<style scoped>
.search-option {
  cursor: pointer; /* Changes cursor to pointer when hovering over the search icon */
}

.search-input {
  /* Adjust the style to match the provided image */
  margin: 0; /* Removes margin */
  border: none; /* Removes border */
  outline: none; /* Removes outline */
  border-radius: 20px; /* Rounded corners */
  padding: 5px 10px; /* Padding inside the search bar */
  width: calc(100% - 20px); /* Full width minus padding */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* Shadow for depth */
  transition: all 0.3s; /* Smooth transition for opening/closing */
}

/* This will only apply when showSearchBar is true */
.search-input:focus {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* Deeper shadow when focused */
}


.restaurant-title {
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.go-back {
  display: inline-flex; /* Use inline-flex to keep the button inline */
  align-items: center; /* Align the text and icon vertically */
  padding: 5px 10px; /* Padding around the text and icon */
  color: rgba(0, 0, 0, 0.97);
  text-decoration: none;
  transition: background-color 0.3s, border-color 0.3s; /* Transition for hover effects */
}

.menu-options-container {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Align items to the start of the container */
  gap: 15px; /* Adjust the space between the elements */
  padding: 10px; /* Padding around the entire container */
}

.each-option {
  display: inline-flex;
  align-items: center;
  padding: 5px 15px; /* Adjust padding to give more horizontal space */
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 25px; /* More pronounced rounded corners */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none; /* In case it's a link, remove underline */
  font-size: 0.9rem; /* Consistent font size */
  color: #333; /* Consistent text color */
}

.each-option:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px); /* Lift the element slightly on hover */
}

.each-option svg {
  margin-right: 8px; /* Consistent space between the icon and text */
}

.meal-image {
  width: 40px; /* Slightly larger images */
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px; /* Consistent space between the image and text */
}

/* Style the text within the option for better visual */
.each-option span {
  font-size: 0.9rem; /* Adjust font size as needed */
  color: #333; /* Text color */
}
</style>