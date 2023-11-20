<template>
  <div id="nav-bar">


    <!-- Left Section -->
    <div class="left-section">
      <router-link v-if="!isAuthenticated" to="/login" id="log-link">
        <button class="nav-item">Login</button>
      </router-link>
      <router-link v-if="!isAuthenticated" to="/register" id="reg-link">
        <button class="nav-item">Register</button>
      </router-link>

      <button v-if="isAuthenticated" @click="logout" class="m-5">Logout</button>
      <span v-if="isAuthenticated" class="user-span">  Hello, {{ loggedInUser }}!</span>

    </div>

    <!-- Title -->
    <div class="header">
      <router-link to="/" id="products-link">
        <h1>OrderAI</h1>
      </router-link>
    </div>

    <!-- Right Section -->
    <div class="right-section">
      <router-link to="/menu" >
        <button class="nav-item">Profile</button>
      </router-link>
      <router-link to="/aboutus" >
        <button class="nav-item">About Us</button>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    loggedInUser() {
      console.log('Computed loggedInUser', this.$store.getters.getName);
      return this.$store.getters.getName;
    },
  },
  methods: {
    logout() {
      this.$store.commit('clearUserData');
      this.$router.push('/login');
    }
  },
  async created() {
    if (!this.isAuthenticated) {
      this.$router.push("/login");
    } else {
      try {
        await this.$store.dispatch('loadUserData');
        console.log('User data loaded', this.loggedInUser);
      } catch (error) {
        console.error('Failed to load user data on created hook', error);
      }
    }
  }


};

</script>
<style scoped>
#nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.header {
  flex: 1; /* Takes up 1/3 of the width */
}

.left-section, .right-section {
  display: flex;
  align-items: center;
}

.left-section {
  flex: 1; /* Takes up 1/3 of the width */
}

.right-section {
  flex: 2; /* Takes up 2/3 of the width */
  justify-content: flex-end;
}

.nav-item {
  margin: 0 10px; /* Add space between buttons */
}

/* Additional styling for the "Cart!" button */
#cart-link button {
  background-color: #ff5733; /* Change to your desired color */
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Adjust the styles as needed */
</style>
