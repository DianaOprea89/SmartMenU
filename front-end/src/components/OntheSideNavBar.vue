<template>
  <div class="">
    <!-- Vertical Navbar -->
    <div class="navbar">
      <div class="meal-type">
        <router-link to="/starter" class="nav-link">Starters</router-link>
      </div>
      <div class="meal-type">
        <router-link to="/main-course" class="nav-link">Main Courses</router-link>
        <div class="sub-menu">
          <router-link to="/chickenmeat" class="nav-link">Chicken</router-link>
          <router-link to="/fishmeat" class="nav-link">Fish</router-link>
          <router-link to="/porkmeat" class="nav-link">Pork</router-link>
          <router-link to="/cowsmeat" class="nav-link">Cow/Veal</router-link>
        </div>
      </div>
      <div class="meal-type">
        <router-link to="/desserts" class="nav-link">Desserts</router-link>
      </div>
      <div class="meal-type">
        <router-link to="/drinks" class="nav-link">Drinks</router-link></div>

    </div>


  </div>
</template>

<script>
export default {
  name: "OntheSideNavBar"
}
</script>

<style scoped>


.nav-link {
  display: block;
  margin-bottom: 10px;
  text-decoration: none;
  color: #333;
}

.nav-link:hover {
  background-color: #ccc;
}

.meal-type {
  margin-bottom: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-weight: bold;
  color: #333;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  display: flex; /* Use flexbox */
  flex-direction: column; /* Stack inner elements vertically */
  align-items: center; /* Center the inner elements horizontally */
}

.meal-type:hover {
  background-color: #ddd;
  color: #555;
}

/* Style for the second div within "Main Courses" */
.meal-type .sub-menu {
  padding-left: 10px; /* Add left padding to indent */
  font-size: 14px; /* Reduce font size */
  background-color: transparent; /* Remove background color */
  border: none; /* Remove border */
  font-weight: normal; /* Remove bold font weight */
  text-align: left; /* Adjust text alignment */
}

</style>