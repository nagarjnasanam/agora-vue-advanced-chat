<template>
  <div class="login-page bg-light">
    <div class="container">
      <div class="row">
        <div class="col-lg-10 offset-lg-1">
          <h3 class="mb-3">Login Now</h3>
          <div class="bg-white shadow rounded">
            <div class="row">
              <div class="col-md-7 pe-0">
                <div class="form-left h-100 py-5 px-5">
                  <form  class="row g-4" action="javascript:;" @submit="handleSignIn()">
                    <div class="col-12">
                      <label>Username<span class="text-danger">*</span></label>
                      <div class="input-group">
                        <div class="input-group-text">
                          <i class="bi bi-person-fill"></i>
                        </div>
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Enter Username"
                          v-model="loginData.userid"
                        />
                      </div>
                    </div>

                    <div class="col-12">
                      <label>Password<span class="text-danger">*</span></label>
                      <div class="input-group">
                        <div class="input-group-text">
                          <i class="bi bi-lock-fill"></i>
                        </div>
                        <input
                          type="text"
                          class="form-control"
                          v-model="loginData.password"
                          placeholder="Enter Password"
                        />
                      </div>
                    </div>

                    <!-- <div class="col-sm-6">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="inlineFormCheck"
                        />
                        <label class="form-check-label" for="inlineFormCheck"
                          >Remember me</label
                        >
                      </div>
                    </div>

                    <div class="col-sm-6">
                      <a href="#" class="float-end text-primary"
                        >Forgot Password?</a
                      >
                    </div> -->

                    <div class="col-12">
                      <input
                        value="Login"
                        @click="handleSignIn()"
                        type="submit"
                        class="btn btn-primary px-4 float-end mt-4"
                      />
                    
                    </div>
                  </form>

                  <!-- <div class="col-12">
                    <button
                      @click="handleSignIn()"
                      type="submit"
                      class="btn btn-primary px-4 float-end mt-4"
                    >
                      login
                    </button>
                  </div> -->
                </div>
              </div>
              <div class="col-md-5 ps-0 d-none d-md-block">
                <div
                  class="form-right h-100 bg-primary text-white text-center pt-5"
                >
                  <i class="bi bi-bootstrap"></i>
                  <h2 class="fs-1">Welcome Back!!!</h2>
                </div>
              </div>
            </div>
          </div>
          <p class="text-end text-secondary mt-3">
            Bootstrap 5 Login Page Design
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
export default {
  name: "sign-in",

  setup() {
    const loginData = reactive({
      userid: "",
      password: "",
    });
    const { dispatch } = useStore();
    const router = useRouter();
    const handleSignIn = () => {
      console.log("login",loginData);

      if (loginData.userid && loginData.password) {
        console.log("login begin")
        axios
          .post(
            "https://agora-auth.onrender.com//login",
            {
              account: loginData.userid,
              password: loginData.password,
            },
            {
              "Content-Type": "application/json",
            }
          )
          .then((res) => {
            console.log(res);
            localStorage.setItem("AgoraUserId", res.data.chatUsername);
            localStorage.setItem("AgoraToken", res.data.accessToken);
            localStorage.setItem("AgoraAPPToken", res.data.appToken);

            dispatch("login");
            router.push("/");
          })
          .catch((error) => {
            console.log(error.response.data.message);
            alert(error.response.data.message);
          });
      }
    };
    return {
      handleSignIn,
      loginData,
    };
  },
};
</script>


<style>
a {
  text-decoration: none;
}
.login-page {
  width: 100%;
  height: 100vh;
  display: inline-block;
  display: flex;
  align-items: center;
}
.form-right i {
  font-size: 100px;
}
</style>