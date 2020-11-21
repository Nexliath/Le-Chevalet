<template>
  <div>
    <!-- Collection header  -->
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
                  ><i class="fas fa-shopping-cart"></i> Booking</a
                >
              </li>
              <li>
                <a href="shop.html#/login" data-after="Connexion"
                  ><i class="fas fa-user-alt"></i> Connection</a
                >
              </li>
              <li><a href="shop.html#/about" data-after="About"><i class="fas fa-gavel" id="here"></i> About Us</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <!-- End Collection header -->

    <!-- collection-cover Section  -->
    <section id="about-cover">
    <div class="home-cover container">
      <div>
        <h1>Meet our team <span></span></h1> <br>
        <a href="#article-was" type="button" class="cta">Click here</a>
      </div>
    </div>
  </section>
    <!-- collection-cover Section  -->

    <!-- What about us Section  -->
  <div class="article-was" id="article-was">
    <h1 class="title"><span>O</span>ur <span>T</span>eam</h1>
    <p>Meet us !</p>
    <div class="all-article-was">
      <div class="all-article-was-item">
        <a href="https://www.facebook.com/victor.grnr"><img src="img/about/victor-about.jpg"
            alt="Garnier Victor picture"></a>
        <h3 class="sous-titre">Victor <span>GARNIER</span> | Project Manager</h3>
        <p>GARNIER Victor was born in Paris, in 1999. In this project, he worked on all the
          design and the code structure.
        </p>
      </div>
      <div class="all-article-was-item">
        <a href="https://www.facebook.com/victorine.richard.9"><img src="img/about/victorine-about.jpg"
            alt="RICHARD Victorine picture"></a>
        <h3 class="sous-titre">Victorine <span>RICHARD</span> | Designer</h3>
        <p>Victorine Richard was born on May 14, 2000 in Paris. 
          She has a real passion for art history and art in general.</p>
      </div>

    </div>
  </div>
  <!-- End What about us Section  -->
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
      newTableau: {
        name: "",
        painter: "",
        movement: "",
        date: null,
        image: "",
        price: null,
      },
      editingTableau: {
        id: -1,
        name: "",
        painter: "",
        movement: "",
        date: null,
        image: "",
        price: null,
      },
      isActivated: false,
    };
  },
  methods: {
    addTableau() {
      this.$emit("add-tableau", this.newTableau);
    },
    deleteTableau(tableauId) {
      this.$emit("delete-tableau", tableauId);
    },
    addToPanier(tableauId) {
      this.$emit("add-to-panier", tableauId);
    },
    removeFromPanier(tableauId) {
      this.$emit("remove-from-panier", tableauId);
    },
    editTableau(tableau) {
      this.editingTableau.id = tableau.id;
      this.editingTableau.name = tableau.name;
      this.editingTableau.painter = tableau.painter;
      this.editingTableau.movement = tableau.movement;
      this.editingTableau.date = tableau.date;
      this.editingTableau.image = tableau.image;
      this.editingTableau.price = tableau.price;
    },
    sendEditTableau() {
      this.$emit("update-tableau", this.editingTableau);
      this.abortEditTableau();
    },
    abortEditTableau() {
      this.editingTableau = {
        id: -1,
        name: "",
        painter: "",
        movement: "",
        date: null,
        image: "",
        price: null,
      };
    },
    isInPanier(tableauId) {
      return this.panier.tableaux.some((a) => a.id === tableauId);
    },
  },
};
</script>
