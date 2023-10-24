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
                <input type="email" class="form-control" id="email" placeholder="E-mail" required>
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                  <label for="password" class="form-label">Parola</label>
                  <p><router-link to="/recover" id="nav-link">Ai uitat parola?</router-link></p>
                </div>
                <input type="password" class="form-control" id="password" placeholder="Parola" required>
                <div class="form-text small">
                  "Parola trebuie să aibă între 8 și 20 de caractere, să conțină litere și cifre, și să nu conțină spații, caractere speciale sau emoji."
                </div>
              </div>
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">Intra in cont</button>
              </div>
              <div class="text-center mt-3">
                <p>Nu ai cont? <a href="#" class="pe-auto">Registreaza-te</a></p>
              </div>
            </form>
            <hr>
            <div class="text-center">
              <button type="button" class="btn btn-outline-primary col-12">Sign in with Google</button>
              <button type="button" class="btn btn-outline-primary col-12">Sign in with Microsoft</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>





<script>
export default {
  name: "LoginPage"
}
</script>

<style>
#login-panel {
  display: flex;
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