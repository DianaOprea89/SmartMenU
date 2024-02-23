<template>
  <div class="container">
    <div v-if="restaurant">
        <div>
          <h1 class="restaurant-title"><em> Welcome to </em><strong class="text-body-danger">{{ restaurantName }}</strong></h1>
        </div>
      <div v-if="qrCodeData" class="d-flex justify-content-end row" @click="viewRestaurant">
        <p class="col-2"> Qenerated Qr Code</p>
        <img :src="qrCodeData" alt="QR Code" class="col-2" />
      </div>
        <div class="row">
          <div class="col-7">
            <p><strong>About Us: </strong>{{ restaurant.aboutUs }}</p>
            <p><strong>Location:</strong>  {{ restaurant.address }}</p>
            <p><strong>Phone number:</strong> {{ restaurant.phoneNumber }}</p>
          </div>
          <div class="col-5">
            <img :src="restaurant.logoImage" class="card-img-top fixed-size-img" alt="Restaurant">
          </div>
        </div>
      </div>
    <div class="menu-tab row menu-access"  @click="goToViewRestaurantsMenu">
      <div class="col-10">
        <p class="menu-title">MENU</p>
        <p class="menu-times"> From 12PM to 11:30AM</p>
      </div>
      <div class="col-2 align-content-end mt-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor" class="bi bi-plus-lg icon m-2" ><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16" fill="currentColor" class="bi bi-plus-lg icon m-2"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M32.1 29.3C33.5 12.8 47.4 0 64 0H256c16.6 0 30.5 12.8 31.9 29.3l14 168.4c6 72-42.5 135.2-109.9 150.6V448h48c17.7 0 32 14.3 32 32s-14.3 32-32 32H160 80c-17.7 0-32-14.3-32-32s14.3-32 32-32h48V348.4C60.6 333 12.1 269.8 18.1 197.8l14-168.4zm56 98.7H231.9l-5.3-64H93.4l-5.3 64z"/></svg>
      </div>
    </div>

  </div>
</template>

<script>
import api from "@/api/api";
import QRCode from 'qrcode';

export default {
  name: "AccessRestaurant",
  props:{
    restaurantName: {
      type: String,
      required: true
    }
  },
  data(){
    return{
      restaurant: null,
      qrCodeData: '',
    }
  },
  methods:{
    async generateQRCode() {
      try {
        const url = `http://localhost:8080/restaurant/${encodeURIComponent(this.restaurantName)}/accessRestaurant`;
        this.qrCodeData = await QRCode.toDataURL(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    },
    async fetchRestaurant() {
      try {
        // Replace '/api/userData' with the correct endpoint that fetches a single restaurant
        const response = await api.get(`/api/restaurant/${this.restaurantName}`);

        if (response && response.status === 200) {
          // Since you're fetching a single restaurant, you don't need an array
          this.restaurant = response.data; // Update local state
        } else {
          console.error('Failed to fetch restaurant. Status:', response ? response.status : 'Unknown');
        }
      } catch (error) {
        console.error('An error occurred while fetching the restaurant:', error);
      }
    },
    viewRestaurant(){
      this.$router.push({ name: 'ViewRestaurantsMenu' });
    },
    goToViewRestaurantsMenu() {
      // Navigate to the ViewRestaurantsMenu component
      this.$router.push({ name: 'ViewRestaurantsMenu' });
    }
  },
  mounted() {
    this.generateQRCode()
  },
  watch: {
    // Watch for changes to the restaurantName prop
    restaurantName(newName, oldName) {
      if (newName !== oldName) {
        // Regenerate the QR code if the name changes
        this.generateQRCode();
      }
    }
  },
  created() {
    this.fetchRestaurant(); // Fetch restaurants when the component is created
  },
}
</script>

<style scoped>
.restaurant-title{
  font-size: 1.5rem;
}
.menu-tab{
  margin-top: 35px;
  background-color: rgba(255, 0, 0, 0.98);
  color: white;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
}
.menu-access{
  background-color: FF001EFF; /* Or any color you want */
  border-radius: 25px; /* Adjust the px value to make it as round as you like */
  color: white; /* Adjust text color as needed */
  padding: 10px 20px; /* Top/bottom padding 10px, left/right padding 20px */
  margin: 10px; /* Adjust as needed for spacing around the element */
  display: flex; /* Use flexbox for internal alignment */
  justify-content: space-between; /* Space out child elements */
  align-items: center; /* Center items vertically */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Optional: Adds a shadow for depth */
  width: fit-content; /* Adjust the width to fit its content or set a specific width */
  max-width: 100%;
}
.menu-access .menu-title {
  font-size: 1.5rem; /* Adjust the font size as needed */
  font-weight: bold; /* Makes the font bold */
}
.menu-access .menu-times {
  font-size: 1rem; /* Adjust the font size as needed */
}
</style>