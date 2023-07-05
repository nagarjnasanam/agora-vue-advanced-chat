import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"
const app = createApp(App);
app.use(store)
app.use(router)
app.mount('#app')

// createApp(App).use(store).use(router).mount('#app')
