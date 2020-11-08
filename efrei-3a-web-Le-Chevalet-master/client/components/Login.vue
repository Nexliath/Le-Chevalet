<template> 
  <div>

    <section id="header">
      <div class="header container">
        <div class="nav-bar">
          <div class="brand">
            <a href="home.html">
              <h1><span>L</span>e <span>C</span>hevalet</h1>
            </a>
          </div>
          <div class="nav-list">
            <div class="hamburger">
              <div class="bar"></div>
            </div>
            <ul>
              <li><a href="shop.html#/collection" data-after="Service"><i class="fas fa-palette"></i> Collection</a>
              <li><a href="shop.html#/panier" data-after="paintings"><i class="fas fa-shopping-cart"></i> Panier</a></li>
              <li><a href="shop.html#/login" data-after="paintings"><i class="fas fa-user-alt" id="here"></i> Connexion</a></li>
              <li><a href="aboutus.html" data-after="About"><i class="fas fa-gavel" ></i> About</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

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