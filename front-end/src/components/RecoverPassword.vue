<template>
  <div id="login-panel" class="container">
    <div class="row justify-content-center align-items-center vh-100">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted text-center pb-3">Vă rugăm să introduceți adresa dumneavoastră de e-mail si apăsați butonul 'Trimite e-mail'.</h6>
            <div class="mb-3">
              <label for="email" class="form-label text-start">Adresă e-mail</label>
              <input type="email" class="form-control" id="email" placeholder="E-mail" required>
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-outline-dark">Trimite e-mail</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecoverPassword"
}
</script>

<style scoped>
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

</style>