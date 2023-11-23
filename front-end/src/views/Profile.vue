<template>
  <div class="container">
    <div class="content">
      <div>
        <!-- Your introductory content -->
      </div>
      <div>
        <router-link to="/addrestaurant" v-slot="{ navigate }">
          <button class="btn btn-primary mb-4" @click="navigate">Add a Restaurant</button>
        </router-link>
      </div>
      <div>
        <h1 class="text-center mb-4">Your Restaurants</h1>
      </div>
      <div class="row" v-if="restaurants">
        <div class="col-md-4" v-for="(restaurant, index) in restaurants" :key="restaurant._id.$oid">
          <div class="card">
            <img :src="restaurant.logoImage" class="card-img-top fixed-size-img" alt="Restaurant">
            <div class="card-body">
              <h5 class="card-title">{{ restaurant.name }}</h5>
              <p class="card-text">{{ restaurant.aboutUs }}</p>
              <div class="card-contact">
                <p class="card-text">{{ restaurant.address }}</p>
                <p class="card-text">{{ restaurant.phoneNumber }}</p>
              </div>
            </div>
            <div class="card-actions-container">
              <router-link :to="'/restaurant/'+ restaurant.name" class="nolink card-action-button">
                <button class="btn btn-secondary btn-sm more-info-button"> Info</button>
              </router-link>
              <svg
                  class="bi bi-pencil edit-icon"
                  @click="openDialog(index)"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
              >
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
              <div
                  v-if="showDialogOptions[index]"
                  class="custom-dialog"
              >
                <div class="custom-dialog-content">
                  <h2>Edit Restaurant</h2>
                  <div class="form-group">
                    <p>Old name: {{ restaurant.name }}</p>
                    <label :for="'newName' + index">New Name :</label>
                    <input
                        :id="'newName' + index"
                        v-model="newNames[index]"
                        :placeholder="restaurant.name"
                    />
                    <p>Old About Us: {{ restaurant.aboutUs }}</p>
                    <label :for="'newAboutUs' + index">New AboutUs field:</label>
                    <input
                        :id="'newAboutUs' + index"
                        v-model="newAboutUsList[index]"
                        :placeholder="restaurant.aboutUs"
                    />
                    <p>Old Address: {{ restaurant.address }}</p>
                    <label :for="'newAddress' + index">New Address:</label>
                    <input
                        :id="'newAddress' + index"
                        v-model="newAddresses[index]"
                        :placeholder="restaurant.address"
                    />
                    <p>Old phone number: {{ restaurant.phoneNumber }}</p>
                    <label :for="'newPhoneNumber' + index">New Phone Number:</label>
                    <input
                        :id="'newPhoneNumber' + index"
                        v-model="newPhoneNumbers[index]"
                        :placeholder="restaurant.phoneNumber"
                    />
                  </div>
                  <div class="dialog-buttons">
                    <button
                        class="btn btn-primary add-button"
                        @click="editRestaurant(restaurant._id, index)"
                    >
                      Edit
                    </button>
                    <button
                        class="btn btn-secondary cancel-button"
                        @click="closeDialog(index)"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <button class="btn btn-danger btn-sm remove-button" @click="removeRestaurant(restaurant._id)">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import { mapGetters } from 'vuex';
import { getAuthToken } from "../utility/utility.js";

export default {
  name: "ProfilePage",
  data() {
    return {
      showDialogOptions: [],
      newNames: [],
      newAboutUsList: [],
      newAddresses: [],
      newPhoneNumbers: [],
    };
  },
  computed: {
    restaurants() {
      return this.$store.state.user.restaurants;
    },
    ...mapGetters(["getUserId"]),
  },
  methods: {
    openDialog(index) {
      // Close all other dialogs before opening this one
      this.showDialogOptions = this.showDialogOptions.map((_, i) => i === index);
    },
    closeDialog(index) {
      // Close the dialog for the given index
      this.showDialogOptions[index] = false;
    },
    async editRestaurant(restaurantId, index) {
      console.log('Clicked "Edit" button for restaurant with ID:', restaurantId);
      const newName = this.newNames[index];
      const newAboutUs = this.newAboutUsList[index];
      const newAddress = this.newAddresses[index];
      const newPhoneNumber = this.newPhoneNumbers[index];

      const updatedRestaurantDetails = {
        name: newName || "", // Leave empty if not provided
        address: newAddress || "",
        phoneNumber: newPhoneNumber || "",
        aboutUs: newAboutUs || "",
      };

      try {
        const response = await api.put(
            `/api/editRestaurant/${restaurantId}`,
            updatedRestaurantDetails
        );

        if (response && response.status === 200) {
          console.log('Restaurant edited successfully');
          this.$store.commit('updateRestaurant', { id: restaurantId, updatedData: updatedRestaurantDetails });
        } else {
          console.error('Error editing restaurant. Status:', response ? response.status : 'Unknown');
        }
      } catch (error) {
        console.error('An error occurred while editing restaurant:', error);

        if (error.response) {
          console.error('Response Status:', error.response.status);
          console.error('Response Data:', error.response.data);
        }
      }

      // Close the dialog after editing
      this.closeDialog(index);
    },
    async removeRestaurant(restaurantId) {
      console.log('Clicked "Remove" button for restaurant with ID:', restaurantId);
      try {
        const userId = this.$store.getters.getUserId;
        console.log('Removing restaurant with ID:', restaurantId);
        const apiUrl = `/api/removeRestaurant/${userId}/${restaurantId}`;
        console.log('Deleting restaurant with URL:', apiUrl);

        const authToken = getAuthToken();

        console.log('Authorization Token:', authToken);
        const response = await api.delete(apiUrl);

        if (response && response.status === 200) {
          this.$store.commit('removeRestaurant', restaurantId);
          console.log('Restaurant removed successfully');
        } else {
          console.error('Error removing restaurant. Status:', response ? response.status : 'Unknown');
        }

        const updatedResponse = await api.get(`/api/getRestaurants`);
        if (updatedResponse && updatedResponse.status === 200) {
          this.$store.commit('SET_RESTAURANTS', updatedResponse.data);
        } else {
          console.error('Error fetching updated restaurant data. Status:', updatedResponse ? updatedResponse.status : 'Unknown');
        }
      } catch (error) {
        console.error('An error occurred while removing restaurant:', error);

        if (error.response) {
          console.error('Response Status:', error.response.status);
          console.error('Response Data:', error.response.data);
        }
      }
    },
  },
  created() {
    const loadUserDataPromise = this.$store.dispatch('loadUserData');
    const fetchRestaurantsPromise = this.$store.dispatch('fetchRestaurants');

    Promise.all([loadUserDataPromise, fetchRestaurantsPromise])
        .then(() => {
          console.log('User data and restaurants loaded successfully');
        })
        .catch((error) => {
          console.error('Error loading user data or restaurants:', error);
        });
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap; /* Allow cards to wrap to the next line */
  justify-content: space-around; /* Evenly space the cards horizontally */
  gap: 20px; /* Space between cards vertically and horizontally */
  padding: 20px; /* Padding around the container */
}

.card {
  display: flex;
  flex-direction: column; /* Stack children elements vertically */
  width: 300px; /* Fixed width for all cards */
  height: 400px; /* Fixed height for all cards */
  margin-bottom: 20px; /* Space below each card */

}

.card-img-top {
  width: 100%; /* Make image responsive within card */
  height: 150px; /* Fixed image height */
  object-fit: cover; /* Ensure the image covers the area without stretching */
}
.nolink {
  color: inherit; /* Inherit the color from the parent element */
  text-decoration: none; /* No underline */
}
.card-body {
  display: flex;
  flex-direction: column; /* Stack children elements vertically */
  justify-content: space-between; /* Allocate space between content and buttons */
  padding: 15px;
}

.card-text {
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


.card-action-button {
  flex-grow: 1;
  margin-right: 10px;
}


.card-action-button:last-child {
  margin-right: 0;
}

/* Center the edit SVG icon */
.edit-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px; /* Add margin for consistent spacing */
  flex: 0 0 auto; /* Do not grow or shrink the icon */
}

.btn,
.bi-pencil {
  margin-right: 5px; /* Space between buttons and icon */
}
/* Apply the same width and border styling to the buttons as the cards */
.card-actions button,
.card-actions svg {
  width: 100%; /* Full width to match the card */
  border: 1px solid #ddd; /* Border to match the card style */
  border-radius: 4px; /* Rounded corners to match the card style */
  margin-bottom: 10px; /* Consistent margin at the bottom */
}

/* Style for the 'More Info' button */
.more-info-button {
  background-color: #f8f9fa; /* Light grey background to distinguish from 'Remove' */
  border-color: #f8f9fa;
  color: #333; /* Dark text color for visibility */
}

/* Style for the 'Remove' button */
.remove-button {
  background-color: #dc3545; /* Bootstrap 'danger' color */
  border-color: #dc3545;
  color: white; /* White text color for visibility */
}

/* Center the edit SVG icon */
.edit-icon {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

/* Add padding to the buttons to match the card's internal spacing */
.card-actions button {
  padding: 0.375rem 0.75rem; /* Bootstrap's default padding for buttons */
}
.card-actions-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: -1px; /* Align with the card above */
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.card-action-button {
  background-color: #f8f9fa;
  border: none;
  color: #333;
  text-align: center;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  margin-right: 10px; /* Space between buttons */
  flex: 1; /* Allow buttons to grow and fill the space */
}

.edit-icon {
  flex: 0 0 16px; /* Do not grow or shrink the icon */
  margin: 0 20px; /* Space around the icon */
  cursor: pointer;
}

.remove-button {
  background-color: #dc3545;
  border: none;
  color: white;
  text-align: center;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  flex: 1; /* Allow button to grow and fill the space */
}

/* Remove the margin for the last button */
.card-action-button:last-child {
  margin-right: 0;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Allocate space between content */
  padding: 15px; /* Padding inside the card */
  height: 250px; /* Adjust the height as necessary */
}

.card-text {
  margin-bottom: 10px; /* Space between paragraphs */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3; /* Limit text to 3 lines. Adjust number as needed */
}

.card-text:last-child {
  margin-bottom: 0; /* No margin for the last element */
}

/* Ensure the address and phone number are always at the bottom */
.card-contact {
  margin-top: auto; /* Pushes the contact info to the bottom */
}

</style>
