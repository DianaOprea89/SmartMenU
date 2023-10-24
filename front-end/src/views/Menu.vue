<template>
  <div class="container">
    <!-- Vertical Navbar -->
    <div class="navbar">
      <onthe-side-nav-bar></onthe-side-nav-bar>
    </div>

    <!-- Content Area -->
    <div class="content">
      <p>"Introducing our Smart Order Menu app – your ultimate dining companion! Say goodbye to traditional menus and hello to a seamless dining experience. Browse our extensive menu with vibrant visuals, customize your orders effortlessly, and enjoy swift, contactless ordering and payment. Whether you're dining in, ordering takeout, or having food delivered, our app makes every meal a breeze. Elevate your dining experience with convenience and precision – download the Smart Order Menu app today and savor the future of dining!"</p>
      <router-view></router-view>
    </div>
  </div>
</template>



<script>
import OntheSideNavBar from "@/components/OntheSideNavBar";
export default {
  name: "MenuPage",
  components: {OntheSideNavBar},
};
</script>

<style scoped>

.container {
  display: flex;
  justify-content: center;
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
}


</style>
