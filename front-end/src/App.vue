<template>
  <nav-bar></nav-bar>
  <router-view/>
</template>

<script>
import NavBar from "@/components/NavBar";
import { mapActions}  from 'vuex'
export default {
  name: 'App',
  components: {
    NavBar,
  },
  methods: {
    ...mapActions(["loadUserData"]), // Map the loadUserData action to this component
  },
  created() {
    console.log('State on app load:', this.$store.state.user);
    // Call loadUserData when the app starts
    this.loadUserData();
  },
}
</script>

<style>
</style>
