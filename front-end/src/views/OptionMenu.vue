<template>
  <div class="container">
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
        <button class="btn btn-primary auto-width-button" @click="openDialog">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg icon" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
          </svg>
          Meniu Nou
        </button>
        <span class="lighter-text smaller-text">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg> creeaza un nou meniu
        </span>
      </div>
    </div>
    <!-- Custom Dialog -->
    <div class="custom-dialog" v-if="showDialog">
      <div class="custom-dialog-content">
        <h2>Add New Menu Option</h2>
        <div class="form-group">
          <label for="photoLink">Photo Link:</label>
          <input type="text" id="photoLink" v-model="optionMenu.photoLink" />
        </div>
        <div class="form-group">
          <label for="itemName">Option Name:</label>
          <input type="text" id="itemName" v-model="optionMenu.optionName" />
        </div>
        <div class="dialog-buttons">
          <button class="btn btn-primary add-button" @click="addItem">Add</button>
          <button class="btn btn-secondary cancel-button" @click="showDialog = false">Cancel</button>
        </div>
      </div>
    </div>
    <div v-if="restaurantData && restaurantData.menuOptions">
      <div v-for="(menuOption, index) in restaurantData.menuOptions" :key="index" class="menu-option">
        <div class="menu-option-content" v-if="menuOption">
          <div class="menu-option-row">
            <div class="menu-option-info">

              <div class="addedRestaurants">
                <img :src="menuOption.photoLink" alt="added item" class="menu-option-image">
              </div>

              <div class="form-group">
                <p class="menu-option-name">{{ menuOption.optionName }}</p>
              </div>

              <div class="image-edit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16" @click="editOption">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Custom Dialog for Editing Menu Option -->
    <div class="custom-dialog" v-if="showDialogOption">
      <div class="custom-dialog-content">
        <h2>Edit Menu Option</h2>
        <div class="form-group">
          <label for="newPhotoLink">New Photo Link:</label>
          <p>Old option: {{ menuOption.photoLink }}</p>
          <input type="text" id="newPhotoLink" v-model="newOptionMenu.newPhotoLink" />
        </div>
        <div class="dialog-buttons">
          <button class="btn btn-primary add-button" @click="editMenu">Edit</button>
          <button class="btn btn-secondary cancel-button" @click="showDialogOption = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api.js";

export default {
  name: "MainMenu",
  data() {
    return {
      showDialog: false,
      showDialogOption: false,
      optionMenu: {
        photoLink: "",
        optionName: "",
      },
      newOptionMenu: {
        newPhotoLink: "",
        newOptionName: "",
      },
      items: [],
    };
  },
  props: {
    restaurantName: String,
  },
  computed: {
    restaurantData() {
      const data = this.$store.state.user.restaurants.find(
          (restaurant) => restaurant.name === this.restaurantName
      ) || {};

      return data;
    },
  },
  methods: {
    openDialog() {
      this.showDialog = true;
    },
    editOption() {
      this.showDialogOption = true;
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
              this.$router.push(`/restaurant/${this.restaurantName}`);
            } else {
              console.error("Error adding menu option:", response.data.message);
            }
          })
          .catch((error) => {
            console.error("Error adding menu option:", error);
          });
    },
    editMenu() {
      const { newPhotoLink, newOptionName } = this.newOptionMenu;

      // Send a PUT request to edit the menu option
      api
          .put(`/api/editOptionMenuRestaurants/${this.$store.state.user.id}/${this.restaurantName}`, {
            newPhotoLink,
            newOptionName,
          })
          .then((response) => {
            if (response.status === 200) {
              // Find and update the menu option in your local items array
              const updatedOption = this.items.find(
                  (item) => item.photoLink === newPhotoLink
              );
              if (updatedOption) {
                updatedOption.optionName = newOptionName;
              }

              // Clear the input fields and hide the dialog
              this.newOptionMenu.newPhotoLink = "";
              this.newOptionMenu.newOptionName = "";
              this.showDialogOption = false;
            } else {
              console.error("Error editing menu option:", response.data.message);
            }
          })
          .catch((error) => {
            console.error("Error editing menu option:", error);
          });
    },
  },
  created() {
    if (this.$store.state.user.isAuthenticated) {
      this.$store.dispatch("loadUserData");
    }
  },
};
</script>


<style scoped>

.fixed-size-img {
  width: 150px;
  height: 150px;
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


.custom-dialog-content input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}
.menu-option {
  margin-bottom: 10px; /* Space between each menu option */
}

.menu-option-row {
  display: flex;
  justify-content: space-between; /* Distributes space evenly between elements */
  align-items: center; /* Vertically centers the items in the row */

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

  margin-right: 5px; /* Adds margin to the right */
}

.image-edit-icon {
  flex-grow: 1; /* Allows the element to grow if necessary */
  padding: 10px;
}

.menu-option-info {
  display: flex;
  position: relative; /* Needed for absolute positioning of children */
}

.addedRestaurants {
  position: relative; /* Relative positioning */
  margin-right: 10px; /* Space between the image container and the name */
}

.menu-option-image {
  height: 100px; /* Set a fixed height for your images */
  width: auto; /* Adjust width automatically to maintain aspect ratio */
  margin-right: 10px;
}

.menu-option-content svg,
.form-group svg {
  position: absolute;
  top: 0; /* Align to the top of the parent container */
  right: 0; /* Align to the right of the parent container */
  width: 16px; /* Size of the SVG */
  height: 16px;
  cursor: pointer; /* Indicate it's clickable */
}

.menu-option-name {
  display: flex;
  align-items: center;
  font-size: 1em;
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
  position: relative; /* Needed for absolute positioning of children */
  margin-right: 10px; /* Space between the name and the edit icon */
}

.form-group {
  display: flex;
  align-items: center;
  position: relative; /* Relative positioning */
}

/* Additional styling for the edit icon specifically for the name */
.form-group svg {
  width: 12px; /* Smaller size for the edit icon next to the name */
  height: 12px;
  margin-left: 5px; /* Space between the name and the edit icon */
}
.image-edit-icon {
  position: relative; /* Relative positioning for absolute children */
  margin-right: 10px; /* Space between the image container and the edit icon */
}

/* Additional styling for the edit icon specifically for the image */
.image-edit-icon svg {
  width: 16px; /* Size of the SVG */
  height: 16px;
  cursor: pointer; /* Indicate it's clickable */
}

</style>
