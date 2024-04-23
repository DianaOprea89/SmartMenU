<template>
  <div class="add-restaurant-form container text-center" v-if="isAuthenticated">
    <h2 class="text-center mb-4">Add Your Restaurant</h2>
    <form @submit.prevent="addRestaurant">
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
        <button type="submit" class="btn btn-primary btn-sm" @submit="addRestaurant">Add Restaurant</button>
      </div>
    </form>
  </div>
</template>


<script>
import api from "@/api/api";
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
        console.log('Sending request with data:', restaurantData);

        const response = await api.post('/api/addRestaurants', restaurantData);

        if (response.status === 200 || response.status === 201) {
          this.restaurant = { name: '', address: '', phoneNumber: '', aboutUs: '', logoImage: '' };

          this.$router.push("/menu");
        } else {
          const errorData = await response.json();
          alert(`Failed to add restaurant: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error adding restaurant:', error);

      }
    }


  }
}
</script>

<style scoped>
/* Your CSS styles */
</style>