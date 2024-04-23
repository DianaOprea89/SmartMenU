<template>
  <div class="custom-dialog" >
    <div class="custom-dialog-content">
      <h2>Adauga Optiune de masa </h2>
      <div class="form-group">
        <label for="subMenu">Categorie subMeniu:</label>
        <select id="subMenu" v-model="mealOption.categoryMenuOption" class="form-control">
          <option v-for="(option, index) in subMenuOptions" :key="index" :value="option._id">{{ option.subMenuOptionName }}</option>
        </select>
      </div>
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
        <div>
          <label for="unit">Unitate:</label>
          <select id="unit" v-model="mealOption.unit" class="form-control">
            <option value="grams">Grame</option>
            <option value="liters">Litri</option>
            <option value="pieces">Bucata</option>
          </select>
        </div>
      </div>
      <div class="form-group">

        <label for="ingredients">Ingrediente:</label>
        <textarea id="ingredients" v-model="mealOption.ingredients" class="form-control"></textarea>
      </div>
      <div class="form-group">
        <label for="description">Descriere:</label>
        <textarea id="description" v-model="mealOption.description" class="form-control"></textarea>
      </div>
      <div class="form-group">
        <label for="price">Pret:</label>
        <input type="number" id="price" v-model="mealOption.price" class="form-control"/>
      </div>
      <div class="dialog-buttons">
        <button class="btn btn-secondary" @click="closeDialog">Renunta</button>
        <button class="btn btn-primary" @click="submitMealOption">Adauga</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import { getAuthToken } from "@/utility/utility";
import {mapGetters} from "vuex";

export default {
  name: "MealOption",
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
        categoryMenuOption: "",
        userId: '', // Initialize userId
        restaurantId: '', // Initialize restaurantId
        menuOptionId: '', // Initialize menuOptionId

      },
    };
  },
  computed:{
    ...mapGetters({
      getUserId: "getUserId"
    }),
  },
  methods: {
    closeDialog() {
      this.$emit('close'); // Emitting an event named 'close'
    },
    clearForm() {
      this.mealOption = {
        photoLink: "",
        optionName: "",
        quantity: "",
        ingredients: "",
        price: "",
        description: "",
        unit: "",
        categoryMenuOption: ""
      };
    },
    submitMealOption() {
      console.log('Submitting meal option with IDs:', {
        userId: this.userId,
        restaurantId: this.restaurantId,
        menuOptionId: this.menuOptionId,
        subMenuOptionId: this.mealOption.categoryMenuOption,
      });

      const mealOptionData = {
        ...this.mealOption,
        categoryMenuOption: this.mealOption.categoryMenuOption,
      };
      console.log(this.mealOption.categoryMenuOption)

      // You must have userId, restaurantId, menuOptionId, and subMenuOptionId available
      if (!this.userId || !this.restaurantId || !this.menuOptionId || !this.mealOption.categoryMenuOption) {
        console.error("Missing IDs for the request");
        return;
      }

      api.post(`/api/addMealOption/${this.userId}/${this.restaurantId}/${this.menuOptionId}/${this.mealOption.categoryMenuOption}`, mealOptionData, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
          .then(response => {
            this.$emit('meal-option-added', response.data);
            this.clearForm();
            this.closeDialog();
          })
          .catch(error => {
            console.error("Error adding meal option:", error);
          });
    },


    async fetchRestaurantData() {
      if (!this.restaurantName) {
        console.error('Restaurant name is undefined');
        return;
      }
      try {
        const response = await api.get(`/api/restaurant/${encodeURIComponent(this.restaurantName)}`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });

        if (response && response.status === 200 && response.data) {
          const menuOptionData = response.data.menuOptions.find((m) => m.optionName === this.menuOption);

          this.restaurantData = menuOptionData || null;
          this.restaurantId = response.data._id; // Set restaurantId from the response
          if (menuOptionData) {
            this.menuOptionId = menuOptionData._id; // Set menuOptionId
          }
          console.log('Fetched restaurant data:', this.restaurantData);

          // Log individual IDs
          console.log('Restaurant ID:', this.restaurantId);
          console.log('Menu Option ID:', this.menuOptionId);
        } else {
          console.error('Failed to fetch restaurant details. Status:', response ? response.status : 'Unknown');
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    },

  },
  created() {
    console.log('Component created! Fetching restaurant data...');
    this.fetchRestaurantData();
    this.userId = this.getUserId;
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
.form-control {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
.dialog-buttons {
  display: flex;
  justify-content: flex-end;
}
.dialog-buttons button {
  margin-left: 0.5rem;
}
</style>