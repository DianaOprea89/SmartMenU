<template>
  <div class="container">
    <div class="m-2 icon-container">
      <router-link :to="`/restaurant/${encodeURIComponent(restaurantName)}/accessRestaurant`"
                   class="go-back d-flex justify-content-end ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
             class="bi bi-arrow-left-circle m-1" viewBox="0 0 16 16">
          <path fill-rule="evenodd"
                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
        </svg>
      </router-link>
    </div>
    <div class="m-5">
      <h1 class="restaurant-title align-content-center"><strong>{{ restaurantName }}</strong></h1>
    </div>
    <div v-if="restaurant" class="menu-options-container ">
      <div class="each-option search-option" @click="toggleSearchBar">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-search"
             viewBox="0 0 16 16">
          <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </svg>
      </div>

      <div v-if="showSearchBar">
        <input v-model="searchQuery" @input="searchMenuOptions" type="text" placeholder="Search..."
               class="search-input"/>
      </div>
      <div class="each-option" @click="toggleFilter">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-funnel-fill"
             viewBox="0 0 16 16">
          <path
              d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"/>
        </svg>
      </div>
      <div v-if="showFilter">
        <input v-model="filterQuery" type="text" placeholder="Filter meals..." class="filter-input"/>
      </div>

      <div v-for="menuOption in restaurant.menuOptions"
           :key="menuOption._id"
           class="m-1 each-option"
           :class="{ 'search-highlight': isSearchMatch('menuOption', menuOption._id) }"
           @click="setActiveMenu(menuOption._id)">
        <img :src="menuOption.photoLink" alt="Meal image" class="menu-image">
        <span :class="{ 'search-highlight': isSearchMatch('menuOption', menuOption._id) }">{{
            menuOption.optionName
          }} </span>
      </div>
    </div>
    <div class="menu-layout" v-if="restaurantData && restaurantData.subMenuOptions">
      <aside class="menu-sidebar">
        <ul class="submenu-list">
          <li v-for="(subMenuOption) in restaurantData.subMenuOptions"
              :key="subMenuOption._id"
              :class="{ active: activeSubMenu === subMenuOption._id, 'search-highlight': isSearchMatch('subMenuOption', subMenuOption._id) }"
              @click="setActiveSubMenu(subMenuOption._id)">
            <img :src="subMenuOption.photoLink" alt="Menu item" class="menu-option-image">
            <p class="sub-menu-title">{{ subMenuOption.subMenuOptionName }}</p>
          </li>
        </ul>
      </aside>
      <!-- Modified section -->
      <main class="menu-main-content">
        <div v-if="activeSubMenu">
          <ul class="meal-list">
            <li v-for="mealOption in filteredMealOptions" :key="mealOption._id"
                class="meal-item"
                :class="{ 'search-highlight': isSearchMatch('mealOption', mealOption._id) }">
              <img :src="mealOption.photoLink" alt="Meal image" class="meal-image">
              <div class="meal-content">
                <h3>{{ mealOption.optionName }}</h3>
                <p class="meal-description">{{ mealOption.description }}</p>
                <p class="meal-ingredients"><strong>Ingredients:</strong> {{ mealOption.ingredients }}</p>
                <div class="meal-footer">
                  <span class="meal-quantity">{{ mealOption.quantity }} {{ mealOption.unit }}</span>
                  <span class="meal-price">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="black"
                         class="bi bi-cash-coin m-1" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"/>
                      <path
               d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z"/>
                     <path
               d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z"/>
                    <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567"/>
              </svg>
                    {{ mealOption.price }} RON</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";

export default {
  name: "ViewRestaurantsMenu",
  props: {
    restaurantName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      restaurant: {
        menuOptions: [],
      },
      searchQuery: "",
      showSearchBar: false,
      activeSubMenu: null,
      activeMealOptions: [],
      mealOption: {},
      restaurantData: {
        subMenuOptions: [],
      },
      filteredMenuOptions: [],
      searchMatches: [],
      filterQuery: '',
      showFilter: false,
    }
  },
  computed: {
    groupedMealOptions() {
      const groupedOptions = {};
      if (this.restaurantData && this.restaurantData.subMenuOptions) {
        this.restaurantData.subMenuOptions.forEach(subMenuOption => {
          groupedOptions[subMenuOption._id] = {
            mealOptions: subMenuOption.mealOptions,
            subMenuOptionId: subMenuOption._id
          };
        });
      }
      return groupedOptions;
    },
    filteredMealOptions() {
      const activeSubMenuOption = this.restaurantData.subMenuOptions.find(option => option._id === this.activeSubMenu);
      if (!activeSubMenuOption || !activeSubMenuOption.mealOptions) {
        return [];
      }

      const query = this.filterQuery.toLowerCase();
      return activeSubMenuOption.mealOptions.filter(mealOption => {
        return mealOption.optionName.toLowerCase().includes(query) || mealOption.ingredients.toLowerCase().includes(query);
      });
    },
    currentMealOptions() {
      const activeSubMenu = this.restaurantData.subMenuOptions.find(option => option._id === this.activeSubMenu);
      return activeSubMenu ? activeSubMenu.mealOptions : [];
    },
  },
  methods: {
    setActiveMenu(menuOptionId) {
      const menuOption = this.restaurant.menuOptions.find(option => option._id === menuOptionId);
      if (menuOption) {
        this.restaurantData.subMenuOptions = menuOption.subMenuOptions || [];
        if (this.restaurantData.subMenuOptions.length > 0) {
          this.setActiveSubMenu(this.restaurantData.subMenuOptions[0]._id);
        } else {
          this.activeSubMenu = null;
        }
      } else {
        console.error('Menu option not found for ID:', menuOptionId);
      }
    },

    isSearchMatch(type, id) {
      if (!this.searchQuery) return false;
      const searchLower = this.searchQuery.toLowerCase();
      let itemName = '';
      if (type === 'menuOption') {
        const item = this.restaurant.menuOptions.find(option => option._id === id);
        itemName = item ? item.optionName : '';
      } else if (type === 'subMenuOption') {
        const item = this.restaurantData.subMenuOptions.find(option => option._id === id);
        itemName = item ? item.subMenuOptionName : '';
      } else if (type === 'mealOption') {
        // Assuming mealOption IDs are unique across all submenus.
        const allMeals = this.restaurantData.subMenuOptions.flatMap(subMenu => subMenu.mealOptions);
        const item = allMeals.find(option => option._id === id);
        itemName = item ? item.optionName : '';
      }

      return itemName.toLowerCase().includes(searchLower);
    },
    searchMenuOptions() {
      const query = this.searchQuery.toLowerCase();
      this.searchMatches = [];


      this.restaurant.menuOptions.forEach(option => {
        if (option.optionName.toLowerCase().includes(query)) {
          this.searchMatches.push({type: 'menuOption', id: option._id});
        }
      });

      this.restaurantData.subMenuOptions.forEach(option => {
        if (option.subMenuOptionName.toLowerCase().includes(query)) {
          this.searchMatches.push({type: 'subMenuOption', id: option._id});
        }
      });

      this.restaurantData.subMenuOptions.forEach(subMenu => {
        subMenu.mealOptions.forEach(meal => {
          if (meal.optionName.toLowerCase().includes(query)) {
            this.searchMatches.push({type: 'mealOption', id: meal._id});
          }
        });
      });
    },

    setActiveSubMenu(subMenuOptionId) {
      console.log('Attempting to set active submenu with ID:', subMenuOptionId);
      this.activeSubMenu = subMenuOptionId;

    },
    toggleSearchBar() {
      this.showSearchBar = !this.showSearchBar;
      if (!this.showSearchBar) {
        this.searchQuery = "";
        this.filteredMenuOptions = this.restaurant.menuOptions;
      }
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    async fetchRestaurantData() {
      if (!this.restaurantName) {
        return;
      }
      try {
        const response = await api.get(`/api/restaurant/${encodeURIComponent(this.restaurantName)}`);
        if (response && response.status === 200 && response.data) {
          this.restaurant = response.data;
          console.log('Fetched restaurant data:', response.data);
          if (this.restaurant.menuOptions && this.restaurant.menuOptions.length > 0) {
            const firstMenuOption = this.restaurant.menuOptions[0];
            this.setActiveMenu(firstMenuOption._id);
            if (firstMenuOption.subMenuOptions && firstMenuOption.subMenuOptions.length > 0) {
              const firstSubMenuOption = firstMenuOption.subMenuOptions[0];
              this.setActiveSubMenu(firstSubMenuOption._id);
            }
          }
        } else {
          console.error('Failed to fetch restaurant details. Status:', response ? response.status : 'Unknown');
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    }
  },
  async created() {
    await this.fetchRestaurantData();
  },
}
</script>

<style scoped>
.search-highlight {
  background-color: rgba(234, 170, 252, 0.62);
}

.search-option {
  cursor: pointer;
}

.search-input {

  margin: 0;
  border: none;
  outline: none;
  border-radius: 20px;
  padding: 5px 10px;
  width: calc(100% - 20px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}


.search-input:focus {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.filter-input {
  margin: 0;
  border: none;
  outline: none;
  border-radius: 20px;
  padding: 5px 10px;
  width: calc(100% - 20px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.filter-input:focus {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.restaurant-title {
  font-size: 1.5rem;
}

ul {
  padding-left: 0;
  list-style-type: none;
}

li {
  margin: 0;
  padding: 0;

}

.menu-option-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.go-back {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  color: rgba(0, 0, 0, 0.97);
  text-decoration: none;
  transition: background-color 0.3s, border-color 0.3s;
}

.menu-options-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
}

.each-option {
  display: inline-flex;
  align-items: center;
  padding: 5px 15px; /* Adjust padding to give more horizontal space */
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 25px; /* More pronounced rounded corners */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none; /* In case it's a link, remove underline */
  font-size: 0.9rem; /* Consistent font size */
  color: #333; /* Consistent text color */
}

.each-option:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.each-option svg {
  margin-right: 8px;
}

.meal-image {
  width: 150px;
  height: 150px;
  margin-right: 20px;
  border-radius: 5%;
  object-fit: cover;
}

.menu-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
}

.each-option span {
  font-size: 0.9rem;
  color: #333;
}

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
  background-color: #ddd;
}

.menu-sidebar {
  background: #f9f9f9;
  padding: 1rem;
}

.custom-dialog-content input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}

.submenu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.submenu-list li {
  padding: 0.5rem 0;
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
  font-family: cursive;
  color: #ff4405;
}
</style>