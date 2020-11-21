<template>
  <div>
    <!-- Login header  -->
    <section id="header">
      <div class="header container">
        <div class="nav-bar">
          <div class="brand">
            <a href="index.html">
              <h1><span>L</span>e <span>C</span>hevalet</h1>
            </a>
          </div>
          <div class="nav-list">
            <div class="hamburger">
              <div class="bar"></div>
            </div>
            <ul>
              <li>
                <a href="shop.html#/collection" data-after="Collection"
                  ><i class="fas fa-palette"></i> Collection</a
                >
              </li>
              <li>
                <a href="shop.html#/panier" data-after="Panier"
                  ><i class="fas fa-shopping-cart"></i>Booking</a
                >
              </li>
              <li>
                <a href="shop.html#/login" data-after="Connexion"
                  ><i class="fas fa-user-alt" id="here"></i> Connection</a
                >
              </li>
              <li><a href="shop.html#/about" data-after="About"><i class="fas fa-gavel" ></i> About Us</a></li>
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
        <h1>Connect <span></span></h1>
        <a href="shop.html#/register" type="button" class="cta-login">Not registered yet? Click here</a>
        <input type="email" v-model="email" placeholder="E-mail" required>
        <input type="password" v-model="password" placeholder="Mot de passe" required>
        <button class="validate" type="submit">Login</button>
        
      </form>
    </div>
    <div v-else>
      <h1>Welcome {{user.email}}</h1>
        <p> <button @click="logout()">Logout</button></p>
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
    user: { type: Object }
  },
  data() {
    return {
      email: '',
      password: '',
    }
  },

  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    submit() {
      this.$emit('login', { email: this.email, password: this.password })
    },
    logout() {
      this.$emit('logout')
    }
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  width: 100%;
  margin-bottom: 25px;
}

button {
  padding: 7.5px 10px;
  border-radius: 10px;
  border: none;
}

input {
  flex-grow: 1;
  flex-basis: 100%;
  border-radius: 20px;
  background: #ffffff;
  margin-bottom: 25px;
  font-size: 1.5em;
  padding: 0 15px;
  border: none;
  

}

form {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 380px;
}

.login {
  display: flex;
  justify-content: center;
}

.in-login {
  display: flex;
  padding: 25px;
  border-radius: 25px;
}

.validate {
  background-color: #fff;
  transition: 0.5ms ease;
}

.validate:hover {
  cursor: pointer;
  background-color: lightgreen;
  transition: .5s ease;
}

.mismatch {
  border-color: red;
}
</style>