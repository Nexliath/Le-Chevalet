<template>
  <div>
    <!-- Login header  -->
    <section id="header">
      <div class="header container">
        <div class="nav-bar">
          <div class="brand">
            <a href="index.html"><h1><span>L</span>e <span>C</span>hevalet</h1></a>
          </div>
          <div class="nav-list">
            <div class="hamburger">
              <div class="bar"></div>
            </div>
            <ul>
              <li><a href="shop.html#/collection" data-after="Collection"><i class="fas fa-palette"></i> Collection</a></li>
              <li><a href="shop.html#/panier" data-after="Panier"><i class="fas fa-shopping-cart"></i> Booking</a></li>
              <li><a href="shop.html#/login" data-after="Connexion"><i class="fas fa-user-alt" id="here"></i> Login</a></li>
              <li><a href="shop.html#/about" data-after="About"><i class="fas fa-gavel"></i> About Us</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <!-- End Login header  -->

    <!-- login-cover Section  -->
    <section id="login-cover">
      <div class="home-cover container">
        <div class="login">
          <div class="in-login" v-if="user === null">
            <form @submit.prevent="submit">
              <h1>log in <span></span></h1>
              <a href="shop.html#/register" type="button" class="cta-login">Not registered yet? Click here</a>
              <input type="email" v-model="email" placeholder="E-mail" required/>
              <input type="password" v-model="password" placeholder="Password" required/>
              <button class="validate" type="submit">Login</button>
            </form>
          </div>
          <div v-else>
            <h1>Welcome !<span></span></h1>
            <div class="connected-center">
              <p>{{ user.email }}</p>
              <button class="disconnect" @click="logout()">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- end login-cover Section  -->
  </div>
</template>
 
<script>
module.exports = {
  props: {
    tableaux: { type: Array, default: [] },
    panier: { type: Object },
    user: { type: Object },
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },

  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    submit() {
      this.$emit("login", { email: this.email, password: this.password });
    },
    logout() {
      this.$emit("logout");
    },
  },
};
</script>
