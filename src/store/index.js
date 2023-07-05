import { createStore } from 'vuex'
import Cookies from "js-cookie";
export default createStore({
  state: {
    login: Cookies.get("logedIn"),
    loading: false,
    error: null,
    user: "",
  },
  getters: {
    getCurrentUserDetails(state) {
      console.log("state", state);
      return state.user;
    },
  },
  mutations: {
    setCurrentUserDetails(state, email) {
      console.log(email);
      state.user = email;
    },
    loginBegin(state) {
      state.login = true;
    },
    loginSuccess(state, data) {
      state.loading = false;
      state.login = data;
    },
  
    loginErr(state, err) {
      state.loading = false;
      state.error = err;
    },
  
    logoutBegin(state) {
      state.loading = true;
    },
  
    logoutSuccess(state, data) {
      state.loading = false;
      state.login = data;
    },
  
    logoutErr(state, err) {
      state.loading = false;
      state.error = err;
    },
  },
  actions: {
    async login({ commit }) {
      try {
        commit("loginBegin");
        Cookies.set("logedIn", true);
        return commit("loginSuccess", true);
      } catch (err) {
        commit("loginErr", err);
      }
    },
    async logOut({ commit }) {
      try {
        commit("logoutBegin");
        Cookies.remove("logedIn");
        commit("logoutSuccess", null);
      } catch (err) {
        commit("logoutErr", err);
      }
    },
  },
  modules: {
  }
})
