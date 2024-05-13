<template>
  <div id="login-panel" class="container">
    <div class="row justify-content-center align-items-center vh-100">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title text-center pb-3">Conectare</h3>
            <h4 class="card-subtitle mb-2 text-muted text-center pb-3">Bine ai venit la OrderAI</h4>
            <form>
              <div class="mb-3">
                <label for="email" class="form-label text-start">Adresă e-mail</label>
                <input type="email" class="form-control" id="email" placeholder="E-mail" required autocomplete="email" v-model="email">
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                  <label for="password" class="form-label">Parola</label>
                  <p><router-link to="/recover" id="nav-link">Ai uitat parola?</router-link></p>
                </div>
                <input type="password" class="form-control" id="password" placeholder="Parola" required autocomplete="current-password" v-model="password" >
                <div class="form-text small">
                  "Parola trebuie să aibă între 8 și 20 de caractere, să conțină litere și cifre, și să nu conțină spații, caractere speciale sau emoji."
                </div>
              </div>
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary" @click="login">Intra in cont</button>
              </div>
              <div class="text-center mt-3">
                <p>Nu ai cont? <a href="#" class="pe-auto" @click="goToRegister">Registreaza-te</a></p>
              </div>
            </form>
            <hr>
            <div class="text-center">
              <button type="button" class="btn btn-outline-primary col-12"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-microsoft" viewBox="0 0 16 16">
                <path d="M7.462 0H0v7.19h7.462V0zM16 0H8.538v7.19H16V0zM7.462 8.211H0V16h7.462V8.211zm8.538 0H8.538V16H16V8.211z"/>
              </svg>    Sign in with Microsoft</button>
              <button type="button" class="btn btn-outline-primary col-12"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
              </svg>    Sign in with  Google</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {

        console.log("Trying to login with", { email: this.email, password: this.password });

        const response = await fetch("http://localhost:8013/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            id: this.id,

          }),
        });




        console.log("Got response", response);
        if (response.ok) {
          const { user, token } = await response.json();


          localStorage.setItem('jwtToken', token);


          this.$store.commit('setUser', {
            email: user.email,
            name: user.name,
            id: user.id,

          });

          this.$router.push('/menu');
        } else {
          console.error("Failed to login");
        }


      } catch (error) {
        console.error("Error logging in:", error);
      }
    },

    goToRegister() {
      this.$router.push('/register');
    }
  },
};
</script>


<style>
#login-panel {
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.card {
  max-width: 900px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  padding: 20px;
}
.small {
  font-size: 50%; /* You can adjust the percentage to control the text size */
}
</style>