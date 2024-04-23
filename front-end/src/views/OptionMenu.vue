<template>
  <div class="container">
    <div class="m-2 icon-container m-5 ">
      <router-link to="/menu" class="go-back d-flex justify-content-end ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle m-1" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
        </svg>
      </router-link>
    </div>
    <div class="row">
      <div class="col-7">
        <h1>{{ restaurantData.name }}</h1>
        <p>{{ restaurantData.aboutUs }}</p>
        <p>{{ restaurantData.address }}</p>
        <p>{{ restaurantData.phoneNumber }}</p>
      </div>
      <div>
        <p>{{restaurantData.tables}}</p>
      </div>
      <div>
        <p>{{restaurantData.rooms}}</p>
      </div>
      <div class="col-5">
        <img :src="restaurantData.logoImage" class="fixed-size-img" alt="the restaurant pictures">
      </div>
    </div>
    <div class="row">
      <div class="col-8">
        <!-- Button to open the custom dialog -->
        <button class="btn btn-secondary auto-width-button m-5" @click="openDialog">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg icon"
               viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                  d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
          </svg>
          Meniu Nou
        </button>
      </div>
      <div class="col-4">
        <button class="btn btn-secondary auto-width-button m-5 align-content-end" @click="preview"> Preview
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-binoculars m-1" viewBox="0 0 16 16">
            <path d="M3 2.5A1.5 1.5 0 0 1 4.5 1h1A1.5 1.5 0 0 1 7 2.5V5h2V2.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5v2.382a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V14.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 14.5v-3a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5v3A1.5 1.5 0 0 1 5.5 16h-3A1.5 1.5 0 0 1 1 14.5V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882zM4.5 2a.5.5 0 0 0-.5.5V3h2v-.5a.5.5 0 0 0-.5-.5zM6 4H4v.882a1.5 1.5 0 0 1-.83 1.342l-.894.447A.5.5 0 0 0 2 7.118V13h4v-1.293l-.854-.853A.5.5 0 0 1 5 10.5v-1A1.5 1.5 0 0 1 6.5 8h3A1.5 1.5 0 0 1 11 9.5v1a.5.5 0 0 1-.146.354l-.854.853V13h4V7.118a.5.5 0 0 0-.276-.447l-.895-.447A1.5 1.5 0 0 1 12 4.882V4h-2v1.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5zm4-1h2v-.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm4 11h-4v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-8 0H2v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5z"/>
          </svg>
        </button>
      </div>

    </div>

    <div v-if="restaurantData && restaurantData.menuOptions" class="menu-options-container">
      <div v-for="(menuOption, index) in restaurantData.menuOptions" :key="index" class="menu-option">
        <div v-if="menuOption" class="menu-option-row m-1">
          <div class="addedRestaurants">
            <img :src="menuOption.photoLink" alt="added item" class="menu-option-image">
          </div>
          <div class="open-menu-option" @click="openMenuOption(menuOption)">
            <p class="menu-option-name">{{ menuOption.optionName }}</p>
          </div>
        </div>

        <div class="icon-container m-3">
          <div class="image-edit-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil edit-icon border-end d-flex flex-row-reverse"
                 viewBox="0 0 16 16" @click="openEditDialog(menuOption)">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3 delete-icon d-flex flex-row " viewBox="0 0 16 16" @click="removeMenuItem(menuOption._id)">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <!-- Custom Dialog -->
    <div class="custom-dialog" v-if="showDialog">
      <div class="custom-dialog-content">
        <h2>Adauga Meniu Nou </h2>
        <div class="form-group">
          <label for="photoLink1"> Link poza:</label>
          <input type="text" id="photoLink1" v-model="optionMenu.photoLink"/>
        </div>
        <div class="form-group">
          <label for="itemName1">Nume optiune Meniu:</label>
          <input type="text" id="itemName1" v-model="optionMenu.optionName"/>
        </div>
        <div class="dialog-buttons">
          <button class="btn btn-secondary cancel-button m-3" @click="showDialog = false">Renunta</button>
          <button class="btn btn-primary add-button m-3" @click="addItem">Adauga</button>

        </div>
      </div>
    </div>

    <!-- Custom Dialog for Editing Menu Option -->
    <div class="custom-dialog" v-if="showDialogOption">
      <div class="custom-dialog-content">
        <h2>Editeaza Meniu Existent</h2>
        <div class="form-group m-3">
          <label for="photoLink">Link poza:</label>
          <input type="text" id="photoLink" v-model="editingMenuOption.photoLink" />
        </div>
        <div class="form-group m-3">
          <label for="itemName">Nume optiune Meniu: </label>
          <input type="text" id="itemName" v-model="editingMenuOption.optionName" />
        </div>
        <div class="dialog-buttons">
          <button class="btn btn-secondary cancel-button m-3 " @click="showDialogOption = false">Renunta</button>
          <button class="btn btn-primary add-button m-3" @click="editMenu">Editeaza</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api.js";
import {getAuthToken} from "@/utility/utility";
import {mapGetters} from "vuex";

export default {
  name: "OptionMenu",
  data() {
    return {
      showDialog: false,
      showDialogOption: false,
      optionMenu: {
        photoLink: "",
        optionName: "",
      },
      restaurants: [],
      newOptionMenu: { optionName: '', photoLink: '' }, // Initialize with default values
      editingMenuOption: null,
      items: [],
      localRestaurantData: {}, // Local data to store restaurant info
    };
  },
  props: {
    restaurantName: {
      type: String,
      required: true
    }
  },
  computed: {
    restaurantData() {
      console.log("localRestaurantData",this.localRestaurantData);
      return this.localRestaurantData || {};
    },
    ...mapGetters({
      getUserId: "getUserId"
    }),
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
    openDialog() {
      this.optionMenu = { photoLink: "", optionName: "" }; // Reset the form
      this.showDialog = true;
    },
    editOption(menuOption) {
      if (menuOption) {
        this.editingMenuOption = JSON.parse(JSON.stringify(menuOption));
        this.showDialogOption = true;
      }
    },
    preview() {
      this.$router.push({
        name: 'AccessRestaurant',
        params: { restaurantName: this.restaurantName }
      });
    },
    openEditDialog(menuOption) {
      this.editingMenuOption = JSON.parse(JSON.stringify(menuOption)); // Clone the current menu option
      this.showDialogOption = true; // Open the dialog
    },
    async removeMenuItem(menuOptionId) {
      const restaurantId = this.restaurantData._id;
      console.log('Removing menu option with ID:', menuOptionId);
      try {
        const userId = await this.fetchUserId();
        console.log('Removing menu option with ID:', menuOptionId);
        const apiUrl = `/api/removeOptionMenuRestaurants/${userId}/${restaurantId}/${menuOptionId}`;
        const authToken = getAuthToken();
        const response = await api.delete(apiUrl, {
          headers: {Authorization: `Bearer ${authToken}`}
        });
        if (response && response.status === 200) {
          // The server has successfully removed the menu item, now update the local state
          const updatedMenuOptions = this.restaurantData.menuOptions.filter(option => option._id !== menuOptionId);
          this.restaurantData.menuOptions = updatedMenuOptions;
          console.log('Menu option removed successfully');
        } else {
          console.error('Error removing menu option. Status:', response ? response.status : 'Unknown');
        }
      } catch (error) {
        console.error('An error occurred while removing menu option:', error);
        // Handle error response if needed
      }
    },
    async addItem() {
      const newItem = {
        photoLink: this.optionMenu.photoLink,
        optionName: this.optionMenu.optionName,
      };
      const userId = await this.fetchUserId();
      api
          .post("/api/addOptionMenuRestaurants", {
            userId: userId,
            name: this.restaurantName,
            newItem,
          })
          .then((response) => {
            if (response.status === 201) {
              this.items.push(newItem);
              this.optionMenu.photoLink = "";
              this.optionMenu.optionName = "";
              this.showDialog = false;
              this.$router.push(`/restaurant/${encodeURIComponent(this.restaurantName.trim())}`);

            } else {
              console.error("Error adding menu option:", response.data.message);
            }
          })
          .catch((error) => {
            console.error("Error adding menu option:", error);
          });
    },
    async editMenu() {
      const userId = await this.fetchUserId();
      const restaurantId = this.localRestaurantData._id;
      const menuOptionId = this.editingMenuOption._id;

      try {
        const response = await api.put(`/api/editOptionMenuRestaurants/${userId}/${restaurantId}/${menuOptionId}`,
            {
              photoLink: this.editingMenuOption.photoLink,
              optionName: this.editingMenuOption.optionName
            },
            {
              headers: { Authorization: `Bearer ${getAuthToken()}` }
            }
        );

        if (response && response.status === 200) {

          const index = this.localRestaurantData.menuOptions.findIndex(option => option._id === menuOptionId);
          if (index !== -1) {
            this.localRestaurantData.menuOptions[index] = { ...this.editingMenuOption };
          }
          console.log('Menu option updated successfully');
          this.showDialogOption = false;
        } else {
          console.error('Error updating menu option. Status:', response ? response.status : 'Unknown');
        }
      } catch (error) {
        console.error('An error occurred while updating menu option:', error);
      }
    },
    openMenuOption(menuOption) {

      this.$router.push({
        name: 'SubMenuOption',
        params: {
          restaurantName: this.restaurantName,
          menuOption: menuOption.optionName
        }
      });
    },
    async fetchRestaurants() {
      try {
        const response = await api.get('/api/userData', {
          headers: {Authorization: `Bearer ${getAuthToken()}`}
        });

        if (response && response.status === 200) {
          this.restaurants = response.data.restaurants; // Update local state
        } else {
          console.error('Failed to fetch restaurants. Status:', response ? response.status : 'Unknown');
        }
      } catch (error) {
        console.error('An error occurred while fetching restaurants:', error);
      }
    },
  },
  async created() {

    try {
      await this.fetchRestaurants();
      const response = await api.get(`/api/restaurant/${encodeURIComponent(this.restaurantName)}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });

      if (response && response.status === 200) {
        this.localRestaurantData = response.data;
      } else {
        console.error('Failed to fetch restaurant details. Status:', response ? response.status : 'Unknown');
      }
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  }
}
</script>
<style scoped>
.menu-options-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* creates three columns */
  gap: 20px; /* adds space between the columns */
}

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
}
.custom-dialog-content input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}
.go-back {
  display: inline-flex; /* Use inline-flex to keep the button inline */
  align-items: center; /* Align the text and icon vertically */
  padding: 5px 10px; /* Padding around the text and icon */
  color: black;
  text-decoration: none;
  transition: background-color 0.3s, border-color 0.3s; /* Transition for hover effects */
}

.go-back:hover {
  background-color: #e6e6e6; /* Slightly darker background on hover */
  border-color: #b3b3b3; /* Darker border on hover */
  text-decoration: none; /* No underline on hover */
}

.go-back svg {
  margin-left: 5px; /* Small space between text and icon */
}
.menu-option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Remove margin-bottom if you have gap in grid */
}

.menu-option-row {
  display: flex;
  align-items: center;
  /* Make sure this is not set to flex-direction: column; */
}

.menu-option-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.menu-option-name {
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
}

.icon-container svg {
  height: 24px;
  width: 24px;
  fill: currentColor;
}
.icon-container svg {
  stroke-width: 2;
}
.icon-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.edit-icon,
.delete-icon {
  width: 20px;
  height: 20px;
  fill: #aaa;
  margin-right: 10px;
  cursor: pointer;
}
</style>