import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"
//vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
    components,
    directives,
})
import Notifications from '@kyvg/vue3-notification'
import Antd from "ant-design-vue";
// import "ant-design-vue/dist/antd.css";
const app = createApp(App);
app.use(vuetify)
app.use(Antd)
app.use(Notifications)
app.use(store)
app.use(router)
app.mount('#app')

// createApp(App).use(store).use(router).mount('#app')
