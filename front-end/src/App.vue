<template>
  <nav-bar></nav-bar>
  <router-view/>
</template>

<script>
import NavBar from "@/components/NavBar";
export default {
  name: 'App',
  components: {
    NavBar,
  },
  created() {
    console.log('State on app load:', this.$store.state.user);
    this.$store.dispatch('loadUserData');
  },
}
</script>

<style>
</style>
