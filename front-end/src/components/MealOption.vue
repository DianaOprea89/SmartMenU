<template>
  <div class="custom-dialog" >
    <div class="custom-dialog-content">
      <h2>Adauga Optiune de masa </h2>
<!--      <div class="form-group">-->
<!--        <label for="unit">Categorie:</label>-->
<!--        <select id="unit" v-model="mealOption.categoryMenuOption" class="form-control">-->
<!--          <option value="subMenuOption" v-for="restaurantData.subMenuOption in subMention">{{subMenuOption}}</option>-->
<!--        </select>-->
<!--      </div>-->
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
        <label for="ingredients">Ingrediente:</label>
        <label for="unit">Unitate:</label>
        <select id="unit" v-model="mealOption.unit" class="form-control">
          <option value="grams">Grame</option>
          <option value="liters">Litri</option>
          <option value="pieces">Bucata</option>
        </select>
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
        <button class="btn btn-primary" @click="addMealOption">Adauga</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import {getAuthToken} from "@/utility/utility";

export default {
  name: "MealOption",
  data() {
    return {
      showDialog: false,
      mealOption: {
        photoLink: "",
        optionName: "",
        quantity: "",
        ingredients: "", // Assuming this is a text description
        price:"",
        description:"",
        unit:"",
        categoryMenuOption:""
      },
    };
  },
  props: ['restaurantName', 'menuOption'],
  methods: {
    closeDialog() {
      this.showDialog = false;
    },
    addMealOption() {
      // Validate the meal option data here
      // Send the meal option data to the server
      // Handle the response from the server
      console.log('Meal option to be added:', this.mealOption);
      // After successful addition, you might want to clear the form and close the dialog
      this.clearForm();
      this.closeDialog();
    },
    clearForm() {
      this.mealOption = {
        photoLink: "",
        optionName: "",
        quantity: "",
        ingredients: "",
        price:"",
        description:"",
        unit:"",
      };
    },
    async fetchRestaurantData() {
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
        } else {
          console.error('Failed to fetch restaurant details. Status:', response ? response.status : 'Unknown');
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    },
  },
  created() {
    this.fetchRestaurantData();
    this.userId = this.getUserId;
  }
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
