<template>
  <div>
    <!-- Register header  -->
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
              <li><a href="shop.html#/collection" data-after="Collection"><i class="fas fa-palette"></i> Collection</a>
              <li><a href="shop.html#/panier" data-after="Panier"><i class="fas fa-shopping-cart"></i> Panier</a></li>
              <li><a href="shop.html#/login" data-after="Connexion"><i class="fas fa-user-alt" id="here"></i> Connexion</a></li>
              <li><a href="aboutus.html" data-after="About"><i class="fas fa-gavel" ></i> About</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <!-- End Register header  -->

    <!-- login-cover Section  -->
    <section id="login-cover">
      <div class="home-cover container">
        <div>
          <h1>Register<span></span></h1>
          <br />
          <div>  
            <div class="col">
              <input
                type="text"
                name="userName"
                placeholder="Username"
                v-model="userName"
                required
              />
              <input
                type="text"
                name="mail"
                placeholder="Email"
                v-model="userEmail"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                v-model="userPassword"
                required
              />
              <input
                type="submit"
                value="Register"
                @click="loginUser(userEmail, userPassword)"
              />
            </div>
          </div>
          <a href="shop.html#/login" type="button" class="cta-login">Already have an account? Click here</a>
        </div>
      </div>
    </section>
    <!-- end login-cover Section  -->
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