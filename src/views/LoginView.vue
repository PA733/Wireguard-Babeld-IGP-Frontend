<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <section class="ftco-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="login-wrap p-4 p-md-5">
          <div class="icon d-flex align-items-center justify-content-center">
            <md-icon>person</md-icon>
          </div>
          <h3 class="text-center mb-4">登录</h3>
          <form action="#" class="login-form">
            <div class="form-group">
              <md-outlined-text-field
                class="form-md-text-field"
                @change="
                  (username = $event.target.value),
                    (form_account_error = false),
                    (form_password_error = false)
                "
                v-bind:error="form_account_error"
                v-bind:error-text="form_account_error_text"
                label="用户名"
                type="text"
              >
                // eslint-disable-next-line vue/no-deprecated-slot-attribute
                <md-icon slot="leading-icon">account_circle</md-icon>
              </md-outlined-text-field>
            </div>
            <div class="form-group d-flex">
              <md-outlined-text-field
                class="form-md-text-field"
                @change="
                  (password = $event.target.value),
                    (form_text_error = false),
                    (form_password_error = false),
                    (form_account_error = false)
                "
                v-bind:error="form_password_error"
                v-bind:error-text="form_password_error_text"
                label="密码"
                type="password"
              >
                // eslint-disable-next-line vue/no-deprecated-slot-attribute
                <md-icon slot="leading-icon">password</md-icon>
              </md-outlined-text-field>
            </div>
            <div class="form-group d-flex">
              <div class="form-buttons">
                <md-filled-button
                  v-bind:disabled="form_button_clicked"
                  v-on:click="submitForm"
                  @submit.prevent="handleSubmit"
                  type="button"
                  id="submit"
                  class="submit-button"
                  >{{ login_button_text }}
                </md-filled-button>
              </div>
            </div>
            <div class="form-group d-flex"></div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from "@/utils/api";

export default {
  name: "LoginPage",
  data() {
    return {
      form_button_clicked: false,
      form_account_error: false,
      form_password_error: false,
      form_account_error_text: "",
      form_password_error_text: "",
      username: "",
      password: "",
      login_button_text: "登录",
      logging_in: false,
    };
  },
  methods: {
    async submitForm() {
      this.form_button_clicked = true;
      if (this.username === "") {
        this.form_account_error = true;
        this.form_account_error_text = "请输入用户名";
        this.form_button_clicked = false;
        return;
      }
      if (this.password === "") {
        this.form_password_error = true;
        this.form_password_error_text = "请输入密码";
        this.form_button_clicked = false;
        return;
      }
      this.login_button_text = "登录中……";
      this.logging_in = true;
      api
        .post("auth/login", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          if (res.status === 200) {
            let token = JSON.parse(JSON.stringify(res.data))["token"];
            localStorage.setItem("jwt_token", token);
            this.$router.push(`/`);
          }
        })
        .catch((error) => {
          if (
            typeof error.response != "undefined" &&
            error.response.status === 401
          ) {
            this.form_account_error = true;
            this.form_password_error = true;
            this.form_account_error_text = "用户名或密码错误";
            this.form_password_error_text = "用户名或密码错误";
          } else {
            alert("未知错误");
          }
          this.form_button_clicked = false;
          this.login_button_text = "登录";
          this.logging_in = false;
        });
    },
  },
};
</script>

<style scoped>
*,
*::before,
*::after {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.ftco-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.container {
  width: 80%;
  max-width: 500px;
  min-width: 300px;
}

.text-center {
  text-align: center !important;
}

.mb-4,
.my-4 {
  margin-bottom: 1.5rem !important;
}

.p-md-5 {
  padding: 3rem !important;
}

.p-4 {
  padding: 1.5rem !important;
}

form {
  display: block;
  margin-top: 0em;
}

.form-group {
  margin-bottom: 1rem;
}

.form-md-text-field {
  width: 100%;
}

.d-flex {
  display: -webkit-box !important;
  display: -ms-flexbox !important;
  display: flex !important;
}

.text-md-right {
  text-align: right !important;
}

.login-wrap {
  position: relative;
  background: #fff;
  border-radius: 10px;
  -webkit-box-shadow: 0px 10px 34px -15px rgba(0, 0, 0, 0.24);
  -moz-box-shadow: 0px 10px 34px -15px rgba(0, 0, 0, 0.24);
  box-shadow: 0px 10px 34px -15px rgba(0, 0, 0, 0.24);
}

.login-wrap .icon {
  width: 80px;
  height: 80px;
  background: var(--md-sys-color-primary);
  border-radius: 50%;
  font-size: 30px;
  margin: 0 auto;
  margin-bottom: 10px;
  --md-icon-size: 48px;
  color: white;
}

.align-items-center {
  -webkit-box-align: center !important;
  -ms-flex-align: center !important;
  align-items: center !important;
  justify-content: center !important;
}

.circular-progress {
  --md-circular-progress-size: 20px;
}

.form-buttons {
  margin-left: auto;
  width: 100%;
}

.submit-button {
  border-radius: 5px;
  padding: 0.5em 1em;
  font-size: 1em;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  height: 50px;
}

.form-links {
  margin-left: auto;
  width: 100%;
}

.form-link-reg {
  color: var(--md-sys-color-primary);
  text-decoration: none;
  font-size: 1.1em;
  font-weight: 500;
  float: right;
}
</style>
