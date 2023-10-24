<template>
  <div class="container">
    <!-- Vertical Navbar -->
    <div class="navbar">
      <onthe-side-nav-bar></onthe-side-nav-bar>
    </div>
    <div class="content">
      <div class="button-container">
        <button class="icon-button">
          <i class="fas fa-phone"></i> Call the Server
        </button>
        <button class="icon-button">
          <i class="fas fa-glass-martini"></i> Request Water Refill
        </button>
        <button class="icon-button">
          <i class="fas fa-coins"></i> Request for Cash Payment
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';
import OntheSideNavBar from "@/components/OntheSideNavBar";

export default {
  name: "CallComponent",
  components: { OntheSideNavBar },
};
</script>

<style scoped>
.icon-button {
  display: block;
  width: 200px;
  margin: 10px;
  padding: 10px;
  text-align: center;
  font-size: 1.2rem;
}

.container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align at the top vertically */
  flex-direction: row;
  height: 100vh;
}

.navbar {
  width: 8%;
  background-color: #f0f0f0;
  padding: 20px;
}

.content {
  flex: 1;
  padding: 20px;
  display: flex;
  justify-content: center; /* Center buttons horizontally */
  align-items: flex-start; /* Align at the top vertically */
}

.button-container {
  display: flex;
  flex-direction: row; /* Display buttons side by side */
  align-items: flex-start; /* Align at the top vertically */
  margin-top: 0; /* Remove top margin to align with top */
}
</style>

