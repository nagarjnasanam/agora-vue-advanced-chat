<template>
  <div class="wrapper">
    <a-spin :spinning="formData.loader">
    <div class="form-left">
     
     
      <p class="text">
        <span>Sub Head:</span>
        Vitae auctor eu augudsf ut. Malesuada nunc vel risus commodo viverra.
        Praesent elementum facilisis leo vel.
      </p>
      <div class="form-field">
        <button>
          <router-link
            :to="{ name: 'SignIn' }"
            class="text-danger text-gradient font-weight-bold"
            >Sign In</router-link
          >
        </button>
      </div>
    </div>
    
      <form class="form-right" action="javascript:;" @submit="handleSignUp">
        <h2 class="text-uppercase">Registration form</h2>
        <div class="row">
          <div class="col-sm-6 mb-3">
            <label>Username</label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              class="input-field"
              v-model="formData.username"
              placeholder="enter username"
            />
          </div>
          <div class="col-sm-6 mb-3">
            <label>Nickname</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              class="input-field"
              placeholder="enter nickname"

              v-model="formData.nickname"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-6 mb-3">
            <label>Password</label>
            <input
              type="password"
              name="pwd"
              id="pwd"
              class="input-field"
              placeholder="enter password"

              v-model="formData.password"
            />
          </div>
          <div class="col-sm-6 mb-3">
            <label>Repeat Password</label>
            <input
              type="password"
              name="cpwd"
              id="cpwd"
              class="input-field"
              placeholder="confirm password"

              v-model="formData.cPassword"
            />
          </div>
        </div>

        <div class="form-field">
          <input
            type="submit"
            value="Register"
            class="register"
            name="register"
          />
          <!-- <button @click="handleSignUp()" class="register">Register</button> -->
        </div>
      </form>
    </a-spin>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
// import { useStore } from "vuex";
import { reactive } from "vue";
function myFunction() {
  alert("The form was submitted");
}
export default {
  name: "sign-up",
  setup() {
    const router = useRouter();

    const formData = reactive({
      username: "",
      password: "",
      nickname: "",
      cPassword: "",
      loader: false,
    });
    const handleSignUp = async () => {
      console.log("register");
      if (
        formData.username &&
        formData.nickname &&
        formData.password &&
        formData.password === formData.cPassword
      ) {
      formData.loader = true;

        await axios
          .post(
            "https://agora-auth.onrender.com/register",
            {
              account: formData.username,
              nickname: formData.nickname,
              password: formData.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            console.log(res);
            formData.loader = false;

            if (res.data) {
              console.log("signup success");
              router.push("/sign-in");
            }
          })
          .catch((error) => {
            console.log(error);
            formData.loader = false;

            alert(error.response.data.data.error);
          });
      }
    };
    return {
      handleSignUp,
      formData,
      myFunction,
    };
  },
};
</script>
  
  <style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap");

/* Reseting */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  background: #00e5ff;
  min-height: 100vh;
}

.wrapper {
  max-width: 850px;
  background-color: #fff;
  border-radius: 10px;
  position: relative;
  display: flex;
  margin: 50px auto;
  box-shadow: 0 8px 20px 0px #1f1f1f1a;
  overflow: hidden;
}

.wrapper .form-left {
  background: #3786bd;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 20px 40px;
  position: relative;
  width: 100%;
  color: #fff;
}

.wrapper h2 {
  font-weight: 700;
  font-size: 25px;
  padding: 5px 0 0;
  margin-bottom: 34px;
  pointer-events: none;
}

.wrapper .form-left p {
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.5;
  pointer-events: none;
}

.wrapper .form-left .text {
  margin: 20px 0 25px;
}

.wrapper .form-left p span {
  font-weight: 700;
}

.wrapper .form-left input {
  padding: 15px;
  background: #fff;
  border-top-left-radius: 5px;
  border-bottom-right-radius: 5px;
  width: 180px;
  border: none;
  margin: 15px 0 50px 0px;
  cursor: pointer;
  color: #333;
  font-weight: 700;
  font-size: 0.9rem;
  appearance: unset;
  outline: none;
}

.wrapper .form-left input:hover {
  background-color: #f2f2f2;
}

.wrapper .form-right {
  padding: 20px 40px;
  position: relative;
  width: 100%;
}

.wrapper .form-right h2 {
  color: #3786bd;
}

.wrapper .form-right label {
  font-weight: 600;
  font-size: 15px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.wrapper .form-right .input-field {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e5e5e5;
  border-top-left-radius: 5px;
  border-bottom-right-radius: 5px;
  outline: none;
  color: #333;
}

.wrapper .form-right .input-field:focus {
  border: 1px solid #31a031;
}

.wrapper .option {
  display: block;
  position: relative;
  padding-left: 30px;
  margin-bottom: 12px;
  font-size: 0.95rem;
  font-weight: 900;
  cursor: pointer;
  user-select: none;
}

.wrapper .option input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.wrapper .checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 2px;
}

.wrapper .option:hover input ~ .checkmark {
  background-color: #f1f1f1;
}

.wrapper .option input:checked ~ .checkmark {
  border: 2px solid #e5e5e5;
  background-color: #fff;
  transition: 300ms ease-in-out all;
}

.wrapper .checkmark:after {
  content: "\2713";
  position: absolute;
  display: none;
  color: #3786bd;
  font-size: 1rem;
}

.wrapper .option input:checked ~ .checkmark:after {
  display: block;
}

.wrapper .option .checkmark:after {
  left: 2px;
  top: -4px;
  width: 5px;
  height: 10px;
}

.wrapper .register {
  padding: 12px;
  background: #3786bd;
  border-top-left-radius: 5px;
  border-bottom-right-radius: 5px;
  width: 130px;
  border: none;
  margin: 6px 0 50px 0px;
  cursor: pointer;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
}

.wrapper .register:hover {
  background-color: #3785bde0;
}

.wrapper a {
  text-decoration: none;
}

@media (max-width: 860.5px) {
  .wrapper {
    margin: 50px 5px;
  }
}

@media (max-width: 767.5px) {
  .wrapper {
    flex-direction: column;
    margin: 30px 20px;
  }

  .wrapper .form-left {
    border-bottom-left-radius: 0px;
  }
}

@media (max-width: 575px) {
  .wrapper {
    margin: 30px 15px;
  }

  .wrapper .form-left {
    padding: 25px;
  }
  .wrapper .form-right {
    padding: 25px;
  }
}
</style>