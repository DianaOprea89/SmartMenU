// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.min.js'; // Import Bootstrap JavaScript

const app = createApp(App);

app.use(router);

app.use(store).mount('#app');



