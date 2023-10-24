<template>
  <div id="page-wrap">
    <div class="input-elements">
      <label for="name">Name: </label>
      <input type="text" name="name" id="name" placeholder="name" v-model="name">
    </div>
    <div class="input-elements">
      <label for="email">Email: </label>
      <input type="email" name="email" id="email" placeholder="email" v-model="email">
    </div>
    <div class="input-elements">
      <label for="password">Password: </label>
      <input type="password" name="password" id="password" placeholder="password" v-model="password">
    </div>
    <div class="input-elements">
      <label for="confirmPassword">Confirm Password: </label>
      <input type="password" name="password" id="confirmPassword" placeholder="confirm your password" v-model="passwordConfirm">
    </div>
    <div>
      <button @click="register">Register</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterPage"
}
</script>

<style scoped>

</style>