<template>
  <div class="container">
    <div class="m-2 icon-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5"/>
      </svg>
    </div>
    <div class="row">
      <div class="col-7">
        <h1>{{ restaurantData.name }}</h1>
        <p>{{ restaurantData.aboutUs }}</p>
        <p>{{ restaurantData.address }}</p>
        <p>{{ restaurantData.phoneNumber }}</p>
      </div>
      <div class="col-5">
        <img :src="restaurantData.logoImage" class="fixed-size-img" alt="the restaurant pictures">
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <!-- Button to open the custom dialog -->
        <button class="btn btn-primary auto-width-button m-5" @click="openDialog">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg icon"
               viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                  d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
          </svg>
          Meniu Nou
        </button>
        <span class="lighter-text smaller-text">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left"
               viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg> creeaza un nou meniu
        </span>
      </div>
    </div>

    <div v-if="restaurantData && restaurantData.menuOptions">
      <div v-for="(menuOption, index) in restaurantData.menuOptions" :key="index" class="menu-option menu-layout">
        <div class="menu-option-content" v-if="menuOption">
          <div class="submenu-list">
            <div class="menu-option-info">

              <div class="addedRestaurants">
                <img :src="menuOption.photoLink" alt="added item" class="menu-option-image">
              </div>
              <div class="open-menu-option">
                <div class="form-group" @click="openMenuOption(menuOption)">
                  <p class="menu-option-name">{{ menuOption.optionName }}</p>
                </div>
              </div>
              <div class="image-edit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil"
                     viewBox="0 0 16 16" @click="editOption(subMenuOption)">
                  <path
                      d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16" @click="removeMenuItem(menuOption._id)">
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Custom Dialog -->
    <div class="custom-dialog" v-if="showDialog">
      <div class="custom-dialog-content">
        <h2>Adauga Meniu Nou </h2>
        <div class="form-group">
          <label for="photoLink"> Link poza:</label>
          <input type="text" id="photoLink" v-model="optionMenu.photoLink"/>
        </div>
        <div class="form-group">
          <label for="itemName">Nume optiune Meniu:</label>
          <input type="text" id="itemName" v-model="optionMenu.optionName"/>
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
        <h2>Editeaza optiunea de meniu</h2>
        <div class="mb-3">
          <label for="newName" class="m-2">Nume: </label>
          <input v-if="newOptionMenu" id="newName" v-model="editingMenuOption.optionName"/>
        </div>
        <div class="mb-3" >
          <label for="newPhotoLink" class="m-2">Link poza: </label>
          <input v-if="newOptionMenu" id="newPhotoLink" v-model="editingMenuOption.photoLink"/>


        </div>
        <div class="dialog-buttons">

          <button class="btn btn-secondary cancel-button m-3" @click="showDialogOption = false">Renunta</button>
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
    async removeMenuItem(menuOptionId) {
      const restaurantId = this.restaurantData._id;
      console.log('Removing menu option with ID:', menuOptionId);
      try {
        const userId = this.$store.getters.getUserId;
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
    addItem() {
      const newItem = {
        photoLink: this.optionMenu.photoLink,
        optionName: this.optionMenu.optionName,
      };

      api
          .post("/api/addOptionMenuRestaurants", {
            userId: this.$store.state.user.id,
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
      const userId = this.getUserId;
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

.fixed-size-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
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
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}
.submenu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}
.menu-layout {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
}

.custom-dialog-content input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}

.menu-option {
  margin-bottom: 10px; /* Space between each menu option */
}



.menu-option-info {

  margin-right: 6px; /* Adds margin to the right */
}

.menu-option-info,
.addedRestaurants,
.image-edit-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.addedRestaurants {

  margin-right: 5px;
}

.image-edit-icon {
  flex-grow: 1;
  padding: 10px;
}

.menu-option-info {
  display: flex;
  position: relative;
}

.addedRestaurants {
  position: relative;
  margin-right: 10px;
}

.menu-option-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}

.menu-option-content svg,
.form-group svg {
  position: absolute;
  top: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.menu-option-name {
  display: flex;
  align-items: center;
  font-size: 1em;
  background-color: #ffffff;
  padding: 5px 10px;
  border-radius: 5px;
  position: relative;
  margin-right: 10px;
}
.open-menu-option{
  cursor: pointer;
}

.form-group {
  display: flex;
  align-items: center;
  position: relative;
}

.form-group svg {
  width: 12px;
  height: 12px;
  margin-left: 5px;
}

.image-edit-icon {
  position: relative;
  margin-right: 10px;
}


.image-edit-icon svg {
  width: 16px;
  height: 16px;
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

</style>
