<template>
  <div class="custom-dialog" >
    <div class="custom-dialog-content">
      <h2>Adauga  masa </h2>
      <div class="form-group">
        <label for="photoLink">Link poza:</label>
        <input type="text" id="photoLink" v-model="mealOption.photoLink" class="form-control"/>
      </div>
      <div class="form-group">
        <label for="optionName">Nume categorie masa:</label>
        <input type="text" id="optionName" v-model="mealOption.optionName" class="form-control"/>
      </div>
      <div class="form-group">
        <label for="quantity">Cantitate</label>
        <input type="number" id="quantity" v-model="mealOption.quantity" class="form-control"/>
      </div>
      <div class="form-group">
        <label for="price">Pret:</label>
        <input type="number" id="price" v-model="mealOption.price" class="form-control"/>
      </div>

      <div class="dialog-buttons">
        <button class="btn btn-secondary" @click="closeDialog">Renunta</button>
        <button class="btn btn-primary">Adauga</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";

export default {
  name: "CartProductListItem",
  props: ['restaurantName', 'menuOption', 'subMenuOptions'],
  data() {
    return {
      showDialog: false,
      mealOption: {
        photoLink: "",
        optionName: "",
        quantity: "",
        ingredients: "",
        price: "",
        description: "",
        unit: "",
        allergens:"",
        categoryMenuOption: "",
        userId: '', // Initialize userId
        restaurantId: '', // Initialize restaurantId
        menuOptionId: '', // Initialize menuOptionId

      },
    };
  },
  methods: {
    closeDialog() {
      this.$emit('close'); // Emitting an event named 'close'
    },
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
    console.log('Component created! Fetching restaurant data...');
    await this.fetchRestaurantData();
    this.userId = await this.fetchUserId();
  },

};
</script>