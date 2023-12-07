<template>
  <div class="container">
    <div>Restaurant : <strong>{{ restaurantName }}</strong></div>
    <div>Optiune de meniu selectata: <strong>{{ menuOption }}</strong> </div>
    <div class="m-5">
      <button class="btn btn-secondary m-3" @click="openDialog">Adauga un submeniu</button>
      <button class="btn btn-secondary m-3">Adauga o optiune de masa</button>
    </div>
    <div v-if="restaurantData && restaurantData.subMenuOptions">
      <div v-for="(subMenuOption, index) in restaurantData.subMenuOptions" :key="index" class="menu-option">
        <div class="menu-option-content" v-if="subMenuOption">
          <div class="menu-option-row">
            <div class="menu-option-info">

              <div class="addedRestaurants">
                <img :src="subMenuOption.photoLink" alt="added item" class="menu-option-image">
              </div>
              <div class="open-menu-option">
                  <p class="menu-option-name">{{ subMenuOption.optionName }}</p>

              </div>
              <div class="image-edit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil"
                     viewBox="0 0 16 16" >
                  <path
                      d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </div>
              <div>
                <button class="btn btn-danger btn-sm remove-button" >Sterge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-dialog" v-if="showDialog">
      <div class="custom-dialog-content">
        <h2>Adauga Submeniu Nou </h2>
        <div class="form-group">
          <label for="photoLink"> Link poza:</label>
          <input type="text" id="photoLink" v-model="subMenu.photoLink"/>
        </div>
        <div class="form-group">
          <label for="itemName">Nume optiune submeniu:</label>
          <input type="text" id="itemName" v-model="subMenu.optionName"/>
        </div>
        <div class="dialog-buttons">
          <button class="btn btn-secondary cancel-button m-3" @click="showDialog = false">Renunta</button>
          <button class="btn btn-primary add-button m-3" @click="addSubMenuItem">Adauga</button>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/api";
import {getAuthToken} from "@/utility/utility";

export default {
  props: ['restaurantName', 'menuOption'],
  data() {
    return {
      subMenu: {
        photoLink: "",
        optionName: "",
      },
      restaurants: [],
      localRestaurantData: {}, // Local data to store restaurant info
      showDialog: false,
    };
  },
  computed: {
    restaurantData() {
      // Check if localRestaurantData and its restaurants array are defined
      if (this.localRestaurantData && this.localRestaurantData.restaurants) {
        const restaurant = this.localRestaurantData.restaurants.find(
            (r) => r.name === this.restaurantName
        );
        if (restaurant && restaurant.menuOptions) {
          const menuOption = restaurant.menuOptions.find(
              (m) => m.optionName === this.menuOption
          );
          return menuOption || {};
        }
      }
      return {};
    },
  },
  methods: {
    openDialog() {
      this.showDialog = true;
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
              if (!this.localRestaurantData.subMenuOption) {
                this.localRestaurantData.subMenuOption = [];
              }
              this.localRestaurantData.subMenuOption.push(newSubMenuItem);
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
    async fetchRestaurantData() {
      try {
        const response = await api.get(`/api/restaurant/${encodeURIComponent(this.restaurantName)}`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });

        if (response && response.status === 200 && response.data) {
          // Find the specific menu option within the restaurant data
          const menuOptionData = response.data.menuOptions.find(
              (m) => m.optionName === this.menuOption
          );

          this.restaurantData = menuOptionData || null;
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
}
};
</script>


<style scoped>

.custom-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  max-width: 400px;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1000;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}


.custom-dialog-content input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}
</style>

