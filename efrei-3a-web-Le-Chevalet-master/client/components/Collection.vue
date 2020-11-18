<template>
  <div>
    <!-- Collection header  -->
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
              <li>
                <a href="shop.html#/collection" data-after="Collection"
                  ><i class="fas fa-palette" id="here"></i> Collection</a
                >
              </li>
              <li>
                <a href="shop.html#/panier" data-after="Panier"
                  ><i class="fas fa-shopping-cart"></i> Panier</a
                >
              </li>
              <li>
                <a href="shop.html#/login" data-after="Connexion"
                  ><i class="fas fa-user-alt"></i> Connexion</a
                >
              </li>
              <li>
                <a href="aboutus.html" data-after="About us"
                  ><i class="fas fa-gavel"></i> About</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <!-- End Collection header -->

    <!-- collection-cover Section  -->
    <section id="collection-cover">
      <div class="home-cover container">
        <div>
          <h1>The collection<span></span></h1>
          <br />
          <a href="#" type="button" class="cta">Take a look</a>
        </div>
      </div>
    </section>
    <!-- collection-cover Section  -->

    <!-- description of the collection  -->
    <section id="services">
    <div class="services container">
      <div class="service-top">
        <h1 class="section-title">A lar<span>g</span>e collection</h1>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum deleniti maiores pariatur assumenda quas
          magni et, doloribus quod voluptate quasi molestiae magnam officiis dolorum, dolor provident atque molestias
          voluptatum explicabo!</p>
      </div>
    </div>
  </section>
  <!-- End description of the collection  -->

  <div>
      <h1>Liste des tableaux</h1>
      <article v-for="tableau in tableaux" :key="tableau.id">
        <div class="article-img">
          <div class="article" :style="{ backgroundImage: 'url(' + tableau.image + ')' }">
          </div>
        </div>
        <div class="article-content" v-if="editingTableau.id !== tableau.id">
          <div class="article-title">
            <h2>{{ tableau.name }}, {{ tableau.date }}- {{ tableau.price }}€</h2>
            <p>{{ tableau.painter }}, {{ tableau.movement }}</p>
            <div>
              <button class="delete" @click="deleteTableau(tableau.id)">Supprimer</button>
              <button class="modify" @click="editTableau(tableau)">Modifier</button>
              <button class="remove-basket" v-if="isInPanier(tableau.id)" @click="removeFromPanier(tableau.id)">Retirer du panier</button>
              <button class="add-basket" v-else="isInPanier(tableau.id)" @click="addToPanier(tableau.id)">Ajouter au panier</button>
            </div>
          </div>
        </div>
        <div class="article-content" v-else>
          <div class="article-title">
            <h2><input type="text" v-model="editingTableau.name"> - <input type="number" v-model="editingTableau.price"></h2>
            <div>
              <button class="add-basket" @click="sendEditTableau()">Valider</button>
              <button class="delete" @click="abortEditTableau()">Annuler</button>
            </div>
          </div>
          <p><input type="text" v-model="editingTableau.painter" placeholder="Painter name"></p>
          <input type="text" v-model="editingTableau.movement" placeholder="Movement of the Tableau">
          <input type="number" v-model="editingTableau.date" placeholder="Date of the tableau">
          <input type="text" v-model="editingTableau.image" placeholder="Lien vers l'image">
        </div>
      </article>
      <form @submit.prevent="addTableau">
        <h2>Nouveau produit à ajouter</h2>
        <input class="title" type="text" v-model="newTableau.name" placeholder="Name of the Tableau" required>
        <input type="number" v-model="newTableau.price" placeholder="Price" required>
        <input class="text" type="text" v-model="newTableau.painter" placeholder="Name of the painter" required>
        <input class="text" type="text" v-model="newTableau.movement" placeholder="Movement type" required>
        <input type="number" v-model="newTableau.date" placeholder="Date of the tableau" required>
        <input type="text" v-model="newTableau.image" placeholder="Lien vers l'image">
        <button class="add-basket" type="submit">Ajouter</button>
      </form>
    </div>
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
      newTableau: {
        name: "",
        painter: "",
        movement:"",
        date: null,
        image: "",
        price: null,
      },
      editingTableau: {
        id: -1,
        name: "",
        painter: "",
        movement:"",
        date: null,
        image: "",
        price: null,
      },
      isActivated: false,
    };
  },

methods: {
    addTableau() {
      this.$emit('add-tableau', this.newTableau)
    },
    deleteTableau(tableauId) {
      this.$emit('delete-tableau', tableauId)
    },
    addToPanier(tableauId) {
      this.$emit('add-to-panier', tableauId)
    },
    removeFromPanier(tableauId) {
      this.$emit('remove-from-panier', tableauId)
    },
    editTableau(tableau) {
      this.editingTableau.id = tableau.id
      this.editingTableau.name = tableau.name
      this.editingTableau.painter = tableau.painter
      this.editingTableau.movement = tableau.movement
      this.editingTableau.date = tableau.date
      this.editingTableau.image = tableau.image
      this.editingTableau.price = tableau.price
    },
    sendEditTableau() {
      this.$emit('update-tableau', this.editingTableau)
      this.abortEditTableau()
    },
    abortEditTableau() {
      this.editingTableau = {
        id: -1,
        name: "",
        painter: "",
        movement:"",
        date: 0,
        image: "",
        price: 0,
      }
    },
    isInPanier(tableauId) {
      return this.panier.tableaux.some(a => a.id === tableauId)
    }
  }
}
</script>


