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
            <option value="gr">Grame</option>
            <option value="ml">Mililitrii</option>
            <option value="p">Bucata</option>
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
      <div class="form-group">
        <label for="allergens">Alergeni:</label>
        <input type="text" id="allergens" v-model="mealOption.allergens" class="form-control"/>
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


export default {
  name: "MealOption",
  props: ['restaurantName', 'menuOption', 'subMenuOptions'],
  data() {
    return {
      showDialog: false,
      restaurantData: {},
      userId: '',
      localSubMenuOptions: [],
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
        userId: '',
        restaurantId: '',
        menuOptionId: '',

      },
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
          this.userId = response.data.id; // Set the userId here
        } else {
          throw new Error('User ID not found in response');
        }
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
      }
    },
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
    async submitMealOption() {
      const mealOptionData = { ...this.mealOption };
       console.log(this.mealOption.categoryMenuOption)

      // You must have userId, restaurantId, menuOptionId, and subMenuOptionId available
      if (!this.userId || !this.restaurantId || !this.menuOptionId || !this.mealOption.categoryMenuOption) {
        console.error("mealOption",this.mealOption.categoryMenuOption);
        console.error("userId:", this.userId);
        console.error("restaurantId:", this.restaurantId);
        console.error("menuOptionId:", this.menuOptionId);
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
      try {
        const response = await api.get(`/api/restaurant/${encodeURIComponent(this.restaurantName)}`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });

        console.log("Response data:", response.data); // Check the entire response data structure

        if (response && response.status === 200 && response.data) {
          this.restaurantId = response.data._id;
          console.log("Restaurant ID:", this.restaurantId);
          console.log("this.menuOption value:", this.menuOption);
          console.log("All menu options:", response.data.menuOptions);
          const menuOptionData = response.data.menuOptions.find(m => m.optionName === this.menuOption || m._id === this.menuOption);

          console.log("Found menuOptionData:", menuOptionData); // Check what's found
          if (menuOptionData) {
            this.menuOptionId = menuOptionData._id;
            console.log("MenuOptionData ID set to:", this.menuOptionId);
            this.localSubMenuOptions = menuOptionData.subMenuOptions || [];
          } else {
            console.error('Menu option data not found.');
          }
        } else {
          console.error('Failed to fetch restaurant details. Status:', response ? response.status : 'Unknown');
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    },
    async initializeComponent() {
      await this.fetchUserId();
      await this.fetchRestaurantData();
      // Any additional initialization
      console.log("Mounted: userId, restaurantId, menuOptionId", this.userId, this.restaurantId, this.menuOptionId);
      // Initialize local copy of subMenuOptions
      this.localSubMenuOptions = [...this.subMenuOptions];
    },
    updateLocalSubMenuOptions(newValue) {
      // Deep clone newValue to ensure no references are kept to the original prop
      this.localSubMenuOptions = JSON.parse(JSON.stringify(newValue));
    },

  },
  watch: {
    subMenuOptions: {
      immediate: true,
      handler(newValue) {
        this.updateLocalSubMenuOptions(newValue);
      }
    }
  },
  async mounted() {
    await this.initializeComponent();
  },
  async created() {
    console.log('Component created! Fetching restaurant data...');
    await this.fetchRestaurantData();
    await this.fetchUserId();
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
