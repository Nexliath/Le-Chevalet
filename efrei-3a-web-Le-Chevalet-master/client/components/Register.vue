<template>
  <div>
      <div class="image-banniere-register">
            <div class="contenu-banniere-register">
                <h1><span>Register<span></h1>

                <button class="speed-btn-register">
                    <router-link to='/login' id="nav-deco">Login</router-link>
                </button>

            </div>
            <div class="col">
              <input type="text" name="name" placeholder="Username" v-model="userName" required>
               <input type="text" name="mail" placeholder="Email" v-model="userEmail" required>
               <input type="password" name="password" placeholder="Password" v-model="userPassword" required>
               <input type="submit" value="Register" aler @click="registerUser(userEmail, userPassword)">
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
      userName: "",
      userEmail: "",
      userPassword: "",
    };
  },
  async mounted() {},
  methods: {
    registerUser(userEmail, userPassword) {
      this.$emit("register-user", userEmail, userPassword);
    },
  },
};
</script>