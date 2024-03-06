<template>
  <div id="login-panel" class="container">
    <div class="row justify-content-center align-items-center vh-100">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title text-center pb-3">Creeaza un cont</h3>
            <form @submit.prevent="register">
              <div class="mb-3 ">
                <div class="d-flex justify-content-between align-items-center">
                  <label for="name" class="form-label text-start">Nume :</label>
                </div>
                <input type="name" class="form-control" id="name" placeholder="name" required v-model="name">
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                <label for="email" class="form-label text-start">Adresă e-mail:</label>
                </div>
                <input type="email" class="form-control" id="email" placeholder="E-mail" required v-model="email">
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                  <label for="password" class="form-label">Parola:</label>
                </div>
                <input type="password" class="form-control" id="password" placeholder="parola" required v-model="password" autocomplete="new-password">

              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                  <label for="password" class="form-label">Confirma parola:</label>
                </div>
                <input type="password" class="form-control" id="confirmPassword" placeholder="confirma parola" required v-model="passwordConfirm" autocomplete="new-password">

              </div>

              <div class="text-center mt-3">
                <button type="submit" class="btn btn-primary">Registreaza-te</button>
              </div>
            </form>
            <hr>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
export default {
  name: "RegisterPage",
  data() {
    return {
      id:"",
      name: "",
      email: "",
      password: "",
      passwordConfirm: ""
    };
  },
  methods: {
    async register() {
      if (!this.name || !this.email || !this.password || !this.passwordConfirm) {
        alert('Please fill all fields');
        return;
      }

      if (this.password !== this.passwordConfirm) {
        alert('Passwords do not match');
        return;
      }



      try {
        const generatedId = uuidv4();
        console.log(generatedId);
        console.log("Data being sent to the server:", JSON.stringify({
          id: generatedId,
          name: this.name,
          email: this.email,
          password: this.password
        }));


        const response = await fetch("http://localhost:8010/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: generatedId,
            name: this.name,
            email: this.email,
            password: this.password,
            passwordConfirm: this.passwordConfirm
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to register");
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        this.$router.push('/login');
        alert("The user has been created. Please login in with the user mail and password in order to continue.")
      } catch (error) {
        console.error('Error:', error);

        alert("Error registering: " + error.message);
      }

    }

  }
};
</script>

<style scoped>
.small{
  font-size: 12px;
  color: grey;
}
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
}


</style>