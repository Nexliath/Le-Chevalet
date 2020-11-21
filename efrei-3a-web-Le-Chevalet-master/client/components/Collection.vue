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
                  ><i class="fas fa-palette" id="here"></i> Collection</a
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
              <li><a href="shop.html#/about" data-after="About"><i class="fas fa-gavel" ></i> About Us</a></li>
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
          <a href="#intro" type="button" class="cta">Take a look</a>
        </div>
      </div>
    </section>
    <!-- collection-cover Section  -->

    

    

    <div class="boutique">
      <div class="intro" id="intro">
        <h1>Pa<span>i</span>nting l<span>i</span>st</h1>
        <!-- description of the collection  -->
        <p>
          Discover our wide choice of paints. <br> Choose from the largest collection ever assembled in the history of mankind.
        </p>
        <!-- End description of the collection  -->
      </div>
      <!-- Beginning of the shop layout  -->
      <div
        v-for="tableau in tableaux"
        :key="tableau.id"
        class="container-painting"
      >
        <div class="content">
          <div class="content-overlay"></div>
          <img class="content-image" :src="tableau.image" />
          <div
            class="content-details fadeIn-top"
            v-if="editingTableau.id !== tableau.id"
          >
            <h3>{{ tableau.name }} | {{ tableau.date }}</h3>
            <p>By {{ tableau.painter }}, movement: {{ tableau.movement }}</p>
            <p>Price: {{ tableau.price }} €</p>
            <div class="button-action">
              <button class="delete" @click="deleteTableau(tableau.id)">
                Delete
              </button>
              <button class="modify" @click="editTableau(tableau)">
                Modify
              </button>
              <button
                class="remove-basket"
                v-if="isInPanier(tableau.id)"
                @click="removeFromPanier(tableau.id)"
              >
                Delete from basket
              </button>
              <button
                class="add-basket"
                v-else="isInPanier(tableau.id)"
                @click="addToPanier(tableau.id)"
              >
                Add to basket
              </button>
            </div>
          </div>
          <!-- End of the shop layout  -->
          <!-- Beginning of the shop modify layout  -->
          <div class="content-details fadeIn-top" v-else>
            <p>
              <input type="text" v-model="editingTableau.name" /> |
              <input type="number" v-model="editingTableau.date" />
            </p>
            <p>
              <input type="text" v-model="editingTableau.painter" />,
              <input type="text " v-model="editingTableau.movement" />
            </p>
            <p><input type="number" v-model="editingTableau.price" /> €</p>
            <div class="button-action">
              <button class="delete" @click="abortEditTableau()">
                Discard
              </button>
              <button class="add-basket" @click="sendEditTableau()">
                Confirm
              </button>
            </div>
          </div>
          <!-- End of the shop modify layout  -->
        </div>
      </div>
    </div>

    <!-- Beginning of the add painting form  -->
    <div class="container-form">
      <form id="newPainting" @submit.prevent="addTableau">
        <h3>Add a new paint<span>i</span>ng</h3>
        <h4>Please fill this form</h4>
        <fieldset>
          <input
            placeholder="Painting's name"
            v-model="newTableau.name"
            type="text"
            tabindex="1"
            required
            autofocus
          />
        </fieldset>
        <fieldset>
          <input
            placeholder="Painter's name"
            v-model="newTableau.painter"
            type="text"
            tabindex="2"
            required
          />
        </fieldset>
        <fieldset>
          <input
            placeholder="Movement type"
            v-model="newTableau.movement"
            type="text"
            tabindex="3"
            required
          />
        </fieldset>
        <fieldset>
          <input
            placeholder="Painting's date"
            v-model="newTableau.date"
            type="number"
            tabindex="4"
            required
          />
        </fieldset>
        <fieldset>
          <input
            placeholder="Painting's link picture"
            v-model="newTableau.image"
            type="text"
            tabindex="5"
            required
          />
        </fieldset>
        <fieldset>
          <input
            placeholder="Price"
            v-model="newTableau.price"
            type="number"
            tabindex="6"
            required
          />
        </fieldset>
        <fieldset>
          <button type="submit">Add the painting</button>
        </fieldset>
      </form>
      <!-- End of the add painting form  -->
    </div>
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
