<template> 
  <div>
      <div class="image-banniere-login">
            <div class="contenu-banniere-login">
                <h1><span>Login<span></h1>
                <button class="speed-btn-login">
                    <router-link to='/register' id="nav-deco">Register</router-link>
                </button>
            </div>
            <div class="col">
              <input type="text" name="mail" placeholder="Email" v-model="userEmail" required>
              <input type="password" name="password" placeholder="Password" v-model="userPassword" required>
              <input type="submit" value="Login" @click="loginUser(userEmail, userPassword)">
            </div>
        </div>
  </div>
        

</template>
 
<script>
module.exports = {
  props: {
    articles: { type: Array, default: [] },
    panier: { type: Object },
  },
  data() {
    return {
      userEmail: "",
      userPassword: "",
    };
  },
  async mounted() {},
  methods: {
    loginUser(userEmail, userPassword) {
      this.$emit("login-user", userEmail, userPassword);
    },
    getUserI(userId) {
      this.$emit("get-user-id", userEmail, userPassword);
    },
  },
};
</script>