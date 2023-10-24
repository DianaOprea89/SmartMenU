<template>
  <div id="nav-bar">


    <!-- Left Section -->
    <div class="left-section">
      <router-link to="/login" id="log-link">
        <button class="nav-item">Login</button>
      </router-link>
      <button @click="logout">Logout</button>
      <router-link to="/register" id="reg-link">
        <button class="nav-item">Register</button>
      </router-link>
    </div>

    <!-- Title -->
    <div class="header">
      <router-link to="/" id="products-link">
        <h1>OrderAI</h1>
      </router-link>
    </div>

    <!-- Right Section -->
    <div class="right-section">
      <router-link to="/menu" id="nav-link">
        <button class="nav-item">Menu</button>
      </router-link>
      <router-link to="/products" id="nav-link">
        <button class="nav-item">My Order</button>
      </router-link>
      <router-link to="/call" id="nav-link">
        <button class="nav-item">Call</button>
      </router-link>
      <router-link to="/checkout" id="nav-link">
        <button class="nav-item">Checkout</button>
      </router-link>
      <router-link to="/aboutus" id="nav-link">
        <button class="nav-item">About Us</button>
      </router-link>
    </div>
  </div>
</template>

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
