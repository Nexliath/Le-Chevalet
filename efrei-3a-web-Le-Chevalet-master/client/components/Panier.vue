<template>
  <div id="all">
    
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
              <li><a href="shop.html#/panier" data-after="paintings"><i class="fas fa-shopping-cart" id="here"></i> Panier</a></li>
              <li><a href="shop.html#/login" data-after="paintings"><i class="fas fa-user-alt"></i> Connexion</a></li>
              <li><a href="aboutus.html" data-after="About"><i class="fas fa-gavel" ></i> About</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

  <!-- about-us-cover Section  -->
    <section id="panier-cover">
      <div class="home-cover container">
        <div>
          <h1>Content panier <span></span></h1> <br>
          <a href="#article-was" type="button" class="cta">Access to it</a>
        </div>
      </div>
    </section>
  <!-- End about-us-cover Section  -->

    <article v-for="tableau in tableaux_panier" :key="tableau.id">
      <div class="article-img">
        <div class="article" :style="{ backgroundImage: 'url(' + tableau.image + ')' }">
        </div>
      </div>
      <div class="article-content" v-if="editingTableau.id !== tableau.id">
        <div class="article-title">
          <h2>{{ tableau.name }}, {{ tableau.date }} - {{ tableau.price }}€ x {{ tableau.quantity }}</h2>
        </div>
        <p class="description">{{ tableau.painter }}, {{ tableau.movement }}</p>
        <div>
          <button class="delete" @click="removeFromPanier(tableau.id)">Remove from basket</button>
          <button class="modify" @click="editTableau(tableau)">Modify</button>
        </div>
      </div>
      <div class="article-content" v-else>
        <div class="article-title">
          <h2>{{ tableau.name }} - {{ tableau.price }}€ x <input type="number" v-model="editingTableau.quantity"></h2>
          <div>
            <button class="validate" @click="sendEditQuantity()">Valider</button>
            <button class="delete" @click="abortEditQuantity()">Annuler</button>
          </div>
        </div>
        <p>{{ tableau.painter }}</p>
      </div>
    </article>
  </div>
</template>

<script>
module.exports = {
  props: {
    tableaux: { type: Array, default: [] },
    panier: { type: Object },
  },
  data() {
    return {
      editingTableau: {
        id: -1,
        quantity: 0
      }
    }
  },
  computed: {
    tableaux_panier() {
      return this.panier.tableaux.map(tableau => ({
        ...tableau,
        ...this.tableaux.find(a => a.id === tableau.id)
      }))
    }
  },
  methods: {
    pay() {
      this.$emit('pay')
    },
    removeFromPanier(tableauId) {
      this.$emit('remove-from-panier', tableauId)
    },
    editTableau(tableau) {
      this.editingTableau.id = tableau.id
      this.editingTableau.quantity = tableau.quantity
    },
    sendEditQuantity() {
      this.$emit('update-panier', this.editingTableau)
      this.abortEditQuantity()
    },
    abortEditQuantity() {
      this.editingTableau = {
        id: -1,
        quantity: 0
      }
    }
  }
}
</script>
