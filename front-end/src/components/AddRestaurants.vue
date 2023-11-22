<template>
  <div class="add-restaurant-form container text-center" v-if="isAuthenticated">
    <h2 class="text-center mb-4">Add Your Restaurant</h2>
    <form @submit="addRestaurant">
      <div class="row mb-3">
        <div class="col-sm-8">
          <input type="text" class="form-control form-control-sm" id="restaurant-name" placeholder="Name" v-model="restaurant.name" required>
        </div>
      </div>
      <div class="row mb-3">

        <div class="col-sm-8">
          <input type="text" class="form-control form-control-sm" id="restaurant-address" placeholder="Address" v-model="restaurant.address">
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-sm-8">
          <input type="text" class="form-control form-control-sm" id="restaurant-phone" placeholder="Phone Number" v-model="restaurant.phoneNumber">
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-sm-8">
          <textarea class="form-control form-control-sm" id="restaurant-about-us" placeholder="About Us" v-model="restaurant.aboutUs"></textarea>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-sm-8">
          <input type="text" class="form-control form-control-sm" id="restaurant-logo" placeholder="Logo Image URL" v-model="restaurant.logoImage">
        </div>
      </div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary btn-sm">Add Restaurant</button>
      </div>
    </form>
  </div>
</template>


<script>
// eslint-disable-next-line no-unused-vars
import router from "@/router";
export default {
  name: "AddRestaurants",
  data() {
    return {
      restaurant: {
        name: '',
        address: '',
        phoneNumber: '',
        aboutUs: '',
        logoImage: ''
      }
    };
  },
  computed: {
      isAuthenticated() {
        console.log("isAuthenticated computed property:", this.$store.getters.isAuthenticated);
        return this.$store.getters.isAuthenticated;
        },
    userId() {

      return this.$store.getters.yourUserIdGetter;
    }
  },
  methods: {
    async addRestaurant() {
      try {
        const restaurantData = {
          ...this.restaurant,
          userId: this.userId
        };

        const response = await fetch("http://localhost:8008/api/addRestaurants", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          },
          body: JSON.stringify(restaurantData)
        });

        if (response.ok) {
          this.restaurant = { name: '', address: '', phoneNumber: '', aboutUs: '', logoImage: '' };
          alert('Restaurant added successfully!');


          setTimeout(() => {
            console.log('After navigation');
            this.$router.push("/menu");
          }, 0);
        } else {

          const errorData = await response.json();
          alert(`Failed to add restaurant: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error adding restaurant:', error);
        alert('Error adding restaurant.');
      }
    }
  }
};
</script>

<style scoped>
/* Your CSS styles */
</style>
