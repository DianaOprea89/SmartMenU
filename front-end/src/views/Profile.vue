<template>
  <div class="container">
    <div class="content">
      <div>
        <!-- Your introductory content -->
      </div>
      <div>
        <router-link to="/addrestaurant" v-slot="{ navigate }">
          <button class="btn btn-secondary mb-4" @click="navigate">Add a Restaurant</button>
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
            <!--         <option-menu  :restaurantName="restaurant.name"/>-->
            <div class="card-actions-container">

              <router-link :to="`/restaurant/${encodeURIComponent(restaurant.name)}`" class="nolink card-action-button" :restaurantName="restaurant.name">
                <button class="btn btn-secondary btn-sm more-info-button">Info</button>
              </router-link>



              <svg
                  class="bi bi-pencil edit-icon m-3"
                  @click="openDialog(restaurant)"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
              >
                <path
                    d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
              <div v-if="isModalOpen" class="backdrop" @click.self="closeDialog">
                <!-- Modal Dialog -->
                <div class="custom-dialog row">
                  <div class="custom-dialog-content ">
                    <h2>Edit Restaurant</h2>
                    <div class="form-group">
                      <div class="mb-3">
                        <label for="newName" class="m-2">Name: </label>
                        <input id="newName" v-model="editingRestaurant.name"/>
                      </div>
                      <div class="mb-3">
                        <label for="newAboutUs" class="m-2">About Us:</label>
                        <input id="newAboutUs" v-model="editingRestaurant.aboutUs"/>
                      </div>
                      <div class="mb-3">
                        <label for="newAddress" class="m-2">Address:</label>
                        <input id="newAddress" v-model="editingRestaurant.address"/>
                      </div>
                      <div class="mb-3">
                        <label for="newPhoneNumber" class="m-2">Phone Number:</label>
                        <input id="newPhoneNumber" v-model="editingRestaurant.phoneNumber"/>
                      </div>

                    </div>
                    <div class="dialog-buttons">
                      <button
                          class="btn btn-secondary cancel-button"
                          @click="closeDialog(index)"
                      >
                        Cancel
                      </button>
                      <button
                          class="btn btn-primary add-button"
                          @click="editRestaurant"
                      >
                        Save
                      </button>

                    </div>
                  </div>
                </div>
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16" @click="removeRestaurant(restaurant._id)">
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
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
import {mapGetters} from 'vuex';
import {getAuthToken} from "../utility/utility.js";
// import OptionMenu from "@/views/OptionMenu";

export default {
  name: "ProfilePage",
  data() {
    return {
      isModalOpen: false,
      editingRestaurant: null,
      restaurants: [],

    };
  },
  props: ['restaurantName'],
  computed: {
    ...mapGetters({
      getUserId: "getUserId"
    }),
  },
  methods: {
    openDialog(restaurant) {
      this.editingRestaurant = JSON.parse(JSON.stringify(restaurant));
      this.isModalOpen = true;
    },
    closeDialog() {
      this.isModalOpen = false;
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
    async editRestaurant() {
      const restaurantData = {
        name: this.editingRestaurant.name,
        aboutUs: this.editingRestaurant.aboutUs,
        address: this.editingRestaurant.address,
        phoneNumber: this.editingRestaurant.phoneNumber
      };

      const userId = this.getUserId;

      try {
        const response = await api.put(
            `/api/editRestaurant/${userId}/${this.editingRestaurant._id}`,
            restaurantData,
            {
              headers: {Authorization: `Bearer ${getAuthToken()}`}
            }
        );

        if (response && response.status === 200) {

          const index = this.restaurants.findIndex(r => r._id === this.editingRestaurant._id);
          if (index !== -1) {

            this.restaurants[index] = {...this.restaurants[index], ...restaurantData};
          }
          console.log('Restaurant edited successfully');

          await this.fetchRestaurants();
          this.closeDialog();

          this.$router.push('/menu');
        } else {
          console.error('Error editing restaurant. Status:', response ? response.status : 'Unknown');
        }
      } catch (error) {
        console.error('An error occurred while editing restaurant:', error);
      }
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
    this.fetchRestaurants(); // Fetch restaurants when the component is created
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
  padding: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  min-width: 300px; /* Minimum card width */
  max-width: 100%; /* Maximum card width */
  flex: 1; /* Allows the card to grow and shrink */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Optional: Adds a shadow for depth */
}

/* Media query for screens smaller than 768px */
@media (max-width: 767px) {
  .card {
    width: 100%; /* Cards take full width on small screens */
    margin-bottom: 15px; /* Smaller margin on small screens */
  }
}

/* Media query for screens larger than 767px and smaller than 1200px */
@media (min-width: 768px) and (max-width: 1199px) {
  .card {
    width: calc(50% - 10px); /* Two cards per row with a little space between */
    margin-bottom: 15px; /* Smaller margin */
  }
}

/* Media query for screens larger than 1200px */
@media (min-width: 1200px) {
  .card {
    width: calc(33.333% - 20px); /* Three cards per row with space between */
  }
}

.card-img-top {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.nolink {
  color: inherit;
  text-decoration: none;
}

.card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  height: 250px; /* Adjusted height */
}

.card-text {
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-contact {
  margin-top: auto; /* Ensure contact info is at the bottom */
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

/* Modal dialog */
.custom-dialog {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 101;
  width: 50%;
  max-width: 500px;
}


.custom-dialog-content {
  overflow-y: auto; /* Allow vertical scrolling */
  max-height: 70vh; /* 70% of the viewport height */
}

/* Style for the title in the dialog */
.custom-dialog h2 {
  margin-top: 0; /* Remove top margin for the title */
}

/* Style for form elements */
.custom-dialog .form-group {
  margin-bottom: 1rem; /* Space between form groups */
}

/* Style for input fields */
.custom-dialog input[type="text"] {
  width: 100%; /* Full width of the container */
  padding: 0.5rem; /* Padding inside the input */
  margin-top: 0.25rem; /* Space above the input */
  margin-bottom: 0.25rem; /* Space below the input */
  border: 1px solid #ccc; /* Subtle border */
  border-radius: 4px; /* Slightly rounded corners for the input */
}

/* Style for buttons at the bottom of the dialog */
.custom-dialog .dialog-buttons {
  display: flex;
  justify-content: space-between; /* Space out buttons */
  margin-top: 1rem; /* Space above buttons */
}

.custom-dialog .btn {
  padding: 0.5rem 1rem; /* Padding inside buttons */
  margin-right: 0.5rem; /* Space between buttons */
}

.custom-dialog .btn:last-child {
  margin-right: 0; /* No margin for the last button */
}

.card-actions-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-action-button,


.edit-icon {
  flex: 0 0 16px;
  margin: 0 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}



.card-action-button:last-child {
  margin-right: 0;
}

.btn,
.bi-pencil {
  margin-right: 5px;
}

.more-info-button {
  background-color: #f8f9fa;
  border-color: #f8f9fa;
  color: #333;
}
</style>