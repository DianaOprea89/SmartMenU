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
      <button v-if="isAuthenticated" @click="logout" class="m-5 btn btn-secondary">Logout</button>
      <span v-if="isAuthenticated" class="user-span">  Hello, {{ loggedInUser }}!</span>
    </div>
    <!-- Title -->
    <div class="header">
      <div>
        <p>SmartDine</p>
      </div>
      <div>
        <img src="../assets/Logo.png" alt="logo" class="logo">
      </div>

    </div>

    <!-- Right Section -->
    <div class="right-section">
      <router-link to="/menu" >
        <button class="nav-item btn btn-secondary">Profile</button>
      </router-link>
      <router-link to="/aboutus" >
        <button class="nav-item btn btn-secondary">About Us</button>
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
  justify-content: space-between; /* Keeps items spread out on the main axis */
  align-items: center; /* Centers items on the cross axis */
  padding: 10px;
}

.header {
  display: flex; /* New: make header also a flex container */
  justify-content: center; /* Center items horizontally */
  align-items: center; /* Center items vertically */
  flex: 1; /* Each child will take 1/3 of the space */
}

.left-section,
.right-section {
  display: flex;
  align-items: center;
  flex: 1; /* Adjusted: make both take 1/3 of the space */
}

.right-section {
  justify-content: flex-end; /* Aligns items to the end of the container */
}

.nav-item {
  margin: 0 10px; /* Space between items */
}

.logo {
  height: auto; /* Adjust the height automatically to maintain aspect ratio */
  width: 100px; /* Adjust width as needed */
}

/* New: Style for the title text to align with logo */
.header p {
  margin: 0; /* Removes default margin */
  padding-right: 10px; /* Adds some space between text and logo */
}

/* Existing styles ... */

</style>
