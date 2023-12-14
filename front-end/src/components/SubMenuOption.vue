<template>
  <div class="container">
    <div>Restaurant: <strong>{{ restaurantName }}</strong></div>
    <div>Optiune de meniu selectata: <strong>{{ menuOption }}</strong></div>
    <div class="m-5">
      <button class="btn btn-secondary m-3" @click="openDialog">Adauga o categorie de meniu</button>
      <button class="btn btn-secondary m-3" @click="openNewDialog">Adauga o optiune de masa</button>
      <meal-option
          v-if="newShowDialog"
          :restaurant-name="restaurantName"
          :menu-option="menuOption"
          :sub-menu-options="restaurantData.subMenuOptions"
          @meal-option-added="handleMealOptionAdded">
      </meal-option>
    </div>
    <div class="menu-layout" v-if="restaurantData && restaurantData.subMenuOptions">
      <aside class="menu-sidebar">
        <ul class="submenu-list">
          <li v-for="(subMenuOption, index) in restaurantData.subMenuOptions" :key="index">
            <img :src="subMenuOption.photoLink" alt="Menu item" class="menu-option-image">
            <p class="sub-menu-title">{{ subMenuOption.subMenuOptionName }}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil edit-icon m-4"
                 viewBox="0 0 16 16" @click="editOption(subMenuOption)">
              <path
                  d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3 m-4" viewBox="0 0 16 16" @click="removeSubMenuItem(subMenuOption._id)">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
            </svg>
          </li>
        </ul>

      </aside>
      <main class="menu-main-content">
        <div v-for="(subMenuOption, index) in restaurantData.subMenuOptions" :key="index">
          <ul class="meal-list">
            <li v-for="mealOption in subMenuOption.mealOptions" :key="mealOption._id" class="meal-item">
              <img :src="mealOption.photoLink" alt="Meal image" class="meal-image">
              <div class="meal-content">
                <h3>{{ mealOption.optionName }}</h3>
                <p class="meal-description">{{ mealOption.description }}</p>
                <p class="meal-ingredients"><strong>Ingredients:</strong> {{ mealOption.ingredients }}</p>
                <div class="meal-footer">
                  <span class="meal-quantity">{{ mealOption.quantity }} {{ mealOption.unit }}</span>
                  <span class="meal-price">{{ mealOption.price }} RON</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
<!--    Creating a custom dialog to add  a new SubMenuOption-->
    <div class="custom-dialog" v-if="showDialog">
      <div class="custom-dialog-content">
        <h2>Adauga Submeniu Nou</h2>
        <div class="form-group">
          <label for="photoLink">Link poza:</label>
          <input type="text" id="photoLink" v-model="subMenu.photoLink" class="image-option"/>
        </div>
        <div class="form-group">
          <label for="itemName">Nume categorie meniu:</label>
          <input type="text" id="itemName" v-model="subMenu.optionName"/>
        </div>
        <div class="dialog-buttons">
          <button class="btn btn-secondary cancel-button m-3" @click="showDialog = false">Renunta</button>
          <button class="btn btn-primary add-button m-3" @click="addSubMenuItem">Adauga</button>
        </div>
      </div>
    </div>

<!--    Adding another custom dialog for editing the subMenOptions that are already dispalyed and saved on the server -->
    <div class="custom-dialog" v-if="showDialogOption">
      <div class="custom-dialog-content">
        <h2>Editeaza categoria meniu</h2>
        <div class="mb-3">
          <label for="newName" class="m-2">Nume: </label>
          <input v-if="newOptionSubMenu" id="newName" v-model="editingSubMenuOption.subMenuOptionName"/>
        </div>
        <div class="mb-3" >
          <label for="newPhotoLink" class="m-2">Link poza: </label>
          <input v-if="newOptionSubMenu" id="newPhotoLink" v-model="editingSubMenuOption.photoLink"/>


        </div>
        <div class="dialog-buttons">

          <button @click="showDialogOption = false">Renunta</button>
          <button class="btn btn-primary add-button m-3" @click="updateSubMenuItem(editingSubMenuOption._id)">Editeaza</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/api";
import { getAuthToken } from "@/utility/utility";
import {mapGetters} from "vuex";
import MealOption from "@/components/MealOption";

export default {
  components: {MealOption},
  props: ['restaurantName', 'menuOption'],
  data() {
    return {
      subMenu: {
        photoLink: "",
        optionName: "",
      },
      restaurantData: '',
      userId: '', // Initialize userId
      restaurantId: '', // Initialize restaurantId
      menuOptionId: '', // Initialize menuOptionId
      showDialog: false,
      showDialogOption: false,
      activeSubMenu: null,
      activeMealOptions: [],
      newShowDialog:false,
      newOptionSubMenu: { optionName: '', photoLink: '' }, // Initialize with default values
      editingSubMenuOption: {
        optionName: '',
        photoLink: '',
        _id: ''
      },
      items: [],
    };
  },
  computed:{
    ...mapGetters({
      getUserId: "getUserId"
    }),
  },
  methods: {
    openDialog() {
      this.showDialog = true;
    },
    openNewDialog(){
      this.newShowDialog =true;
    },
    editOption(subMenuOption) {
      this.editingSubMenuOption.subMenuOptionName = subMenuOption.subMenuOptionName;
      this.editingSubMenuOption.photoLink = subMenuOption.photoLink;
      this.editingSubMenuOption._id = subMenuOption._id;
      this.showDialogOption = true;
    },
    setActiveSubMenu(subMenuId) {
      console.log('setActiveSubMenu called with id:', subMenuId);
      this.activeSubMenu = subMenuId;
      const subMenu = this.restaurantData.subMenuOptions.find(
          (subMenuOption) => subMenuOption._id.$oid === subMenuId
      );
      if(subMenu) {
        console.log('Active subMenu:', subMenu);
        this.activeMealOptions = subMenu.mealOptions || [];
        console.log('Active meal options:', this.activeMealOptions);
      } else {
        console.log('No subMenu found for id:', subMenuId);
        this.activeMealOptions = [];
      }
    },
    addSubMenuItem() {
      const newSubMenuItem = {
        photoLink: this.subMenu.photoLink,
        subMenuOptionName: this.subMenu.optionName,
      };

      api.post("/api/addSubOptionMenuRestaurants", {
        userId: this.$store.state.user.id,
        name: this.restaurantName,
        menuOptionName: this.menuOption,
        newSubMenuItem,
      })
          .then(response => {
            if (response.status === 201) {
              if (!this.restaurantData.subMenuOptions) {
                this.restaurantData.subMenuOptions = [];
              }
              this.restaurantData.subMenuOptions.push(newSubMenuItem);
              this.subMenu.photoLink = "";
              this.subMenu.optionName = "";
              this.showDialog = false;
            } else {
              console.error("Error adding sub-menu item:", response.data.message);
            }
          })
          .catch(error => {
            console.error("Error adding sub-menu item:", error);
          });
    },
    async removeSubMenuItem(subMenuOptionId) {
      // Call the API to delete the sub-menu item
      if (!this.userId || !this.restaurantId || !this.menuOptionId) {
        console.error("Missing IDs for deletion request");
        return;
      }
      try {
        const response = await api.delete(`/api/removeSubMenuOption/${this.userId}/${this.restaurantId}/${this.menuOptionId}/${subMenuOptionId}`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        if (response.status === 200) {
          // Remove the item from the local state
          this.restaurantData.subMenuOptions = this.restaurantData.subMenuOptions.filter(item => item._id !== subMenuOptionId);
        } else {
          console.error("Error removing sub-menu item:", response.data.message);
        }
      } catch (error) {
        console.error("Error removing sub-menu item:", error);
      }
    },
    async updateSubMenuItem(subMenuOptionId) {
      if (!this.userId || !this.restaurantId || !this.menuOptionId || !subMenuOptionId) {
        console.error("Missing IDs for update request");
        return;
      }

      try {
        const response = await api.put(
            `/api/editSubMenuOption/${this.userId}/${this.restaurantId}/${this.menuOptionId}/${subMenuOptionId}`,
            this.editingSubMenuOption, {
              headers: { Authorization: `Bearer ${getAuthToken()}` }
            }
        );
        if (response.status === 200) {
          // Update the local state to reflect the changes
          const index = this.restaurantData.subMenuOptions.findIndex(item => item._id === subMenuOptionId);
          if (index !== -1) {
            this.restaurantData.subMenuOptions[index] = JSON.parse(JSON.stringify(this.editingSubMenuOption));
          }
          this.showDialogOption = false; // Close the dialog
        } else {
          console.error("Error updating sub-menu item:", response.data.message);
        }
      } catch (error) {
        console.error("Error updating sub-menu item:", error);
      }
    },
    handleMealOptionAdded(newMealOption) {
      this.updateSubMenuWithMealOption(newMealOption);
    },
    updateSubMenuWithMealOption(mealOption) {

      const submenu = this.restaurantData.subMenuOptions.find(subMenu => subMenu._id === mealOption.subMenuId);
      if (submenu) {
        submenu.mealOptions.push(mealOption);

      }
      this.newShowDialog=false;
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
        } else {
          console.error('Failed to fetch restaurant details. Status:', response ? response.status : 'Unknown');
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    },
  },
  created() {
    console.log('Restaurant Name:', this.restaurantName); // Debugging line
    this.fetchRestaurantData();
    this.userId = this.getUserId;
  }
};
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: auto;
}

.menu-layout {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
}
.active {
  background-color: #ddd; /* or any color you want for the active state */
}
.menu-sidebar {
  background: #f9f9f9;
  padding: 1rem;
}

.submenu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.submenu-list li {
  padding: 0.5rem 0;
}

.menu-option-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.sub-menu-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}

.menu-main-content {
  background: #fff;
  padding: 1rem;
}

.meal-list {
  list-style: none;
  padding: 0;
}

.meal-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
}

.meal-image {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  object-fit: cover;
  margin-right: 1rem;
}

.meal-content {
  flex: 1;
}

.meal-description {
  font-style: italic;
  margin: 0.5rem 0;
}

.meal-ingredients {
  margin: 0;
}

.meal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.meal-quantity {
  font-size: 0.9rem;
}

.meal-price {
  font-weight: bold;
  color: #333;
}
.submenu-list li {
  padding: 0.5rem 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.active {
  background-color: #ddd; /* or any other style you want */
  /* other styles to make it look "active" */
  cursor: pointer;
  color: #000;
}

</style>

