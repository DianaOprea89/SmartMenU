<template>
  <div>
    <div class="custom-dialog" v-if="isDialogOpen">
      <label for="roomTableSelect">Choose Room/Table:</label>
      <select id="roomTableSelect" v-model="selectedRoomTable">
        <option :v-for="number in numberOfRooms" :value="n">Room/Table {{ number }}</option>
      </select>
      <button @click="addToCart">Add to Cart</button>
    </div>
    <ul>
      <li v-for="item in cartItems" :key="item.id">
        {{ item.name }} - Room/Table: {{ item.roomTable }}
      </li>
    </ul>
  </div>
</template>

<script>
import api from "@/api/api";

export default {
  name: "CartProductListItem",
  data() {
    return {
          restaurant: {
            name: '',
            address: '',
            phoneNumber: '',
            aboutUs: '',
            logoImage: '',
            tables: '',
            rooms: '',
            allergens:'',

          },
          selectedRoomTable: null,
          numberOfRooms: 0, // This should come from the server
          cartItems: [],
        };
  },
  methods: {
    async fetchUserId() {
      try {
        const token = localStorage.getItem('jwtToken'); // Or however you store/access the token
        const response = await api.get('/api/userData', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data && response.data.id) {
          return response.data.id; // Assuming the response includes the user ID
        } else {
          throw new Error('User ID not found in response');
        }
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
        return null; // Handle error or return null if ID couldn't be fetched
      }
    },
    async fetchRestaurantData() {
      if (!this.restaurantName) {
        return;
      }
      try {
        const response = await api.get(`/api/restaurant/${encodeURIComponent(this.restaurantName)}`);
        if (response && response.status === 200 && response.data) {
          this.restaurant = response.data;
          console.log('Fetched restaurant data:', response.data);
          if (this.restaurant.menuOptions && this.restaurant.menuOptions.length > 0) {
            const firstMenuOption = this.restaurant.menuOptions[0];
            this.setActiveMenu(firstMenuOption._id);
            if (firstMenuOption.subMenuOptions && firstMenuOption.subMenuOptions.length > 0) {
              const firstSubMenuOption = firstMenuOption.subMenuOptions[0];
              this.setActiveSubMenu(firstSubMenuOption._id);
            }
          }
        } else {
          console.error('Failed to fetch restaurant details. Status:', response ? response.status : 'Unknown');
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    }
  },
  async created() {
    await this.fetchRestaurantData();
  },

};
</script>