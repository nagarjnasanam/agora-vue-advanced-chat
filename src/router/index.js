import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import store from "../store/index";
import SignIn from "../views/SignIn.vue";
import SignUp from "../views/SignUp.vue";
import AboutViewVue from '../views/AboutView.vue';
const routes = [
  {
    path: '/',
    name: 'home',
    component: AboutViewVue,
  },
  // {
  //   path: "/",
  //   name: "/",
  //   redirect: "/dashboard",
  // },
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   component: AboutViewVue,
  // },
  {
    path: '/about',
    name: 'about',
    component: AboutViewVue,
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignIn,
    meta: { auth: true }
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUp,
    meta: { auth: true },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  // console.log(store.state.auth);
  console.log(store.state.login,to.meta.auth);

  // console.log(to, store);
  if (to.meta.auth && store.state.login) {
    next({ to: "/" });
  } else if (!to.meta.auth && !store.state.login) {
    next({ name: "SignIn" });
  } else {
    next();
  }
});
export default router
