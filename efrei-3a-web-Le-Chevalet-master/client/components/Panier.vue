<template>
  <div id="all">
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
                <a href="shop.html#/collection" data-after="Service"
                  ><i class="fas fa-palette"></i> Collection</a
                >
              </li>
              <li>
                <a href="shop.html#/panier" data-after="paintings"
                  ><i class="fas fa-shopping-cart" id="here"></i> Booking</a
                >
              </li>
              <li>
                <a href="shop.html#/login" data-after="paintings"
                  ><i class="fas fa-user-alt"></i> Login</a
                >
              </li>
              <li>
                <a href="shop.html#/about" data-after="About"
                  ><i class="fas fa-gavel"></i> About Us</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- about-us-cover Section  -->
    <section id="panier-cover">
      <div class="home-cover container">
        <div>
          <h1>your bookings <span></span></h1>
          <br />
          <a href="#intro" type="button" class="cta">Access to it</a>
        </div>
      </div>
    </section>
    <!-- End about-us-cover Section  -->

    <div class="boutique">
      <div class="intro" id="intro">
        <h1>yo<span>u</span>r bask<span>e</span>t</h1>
        <!-- description of the collection  -->
        <p>
          Have you made your choice? <br />
          Perfect ! <br />
        </p>
        <p>
          Total Price: 156181 € <br />
          <button class="reservation" @click="pay()">
            Book !
          </button>
        </p>

        <!-- End description of the collection  -->
      </div>
      <!-- Beginning of the shop layout  -->
      <div
        v-for="tableau in tableaux_panier"
        :key="tableau.id"
        class="container-panier"
      >
        <div class="content-panier">
          <div class="content-overlay-panier"></div>
          <img class="content-image" :src="tableau.image" />
          <div
            class="content-details fadeIn-top"
            v-if="editingTableau.id !== tableau.id"
          >
            <h3>{{ tableau.name }} | {{ tableau.painter }}</h3>
            <p>Price: {{ tableau.price * tableau.quantity }} €</p>
            <p>Quantity : {{ tableau.quantity }}</p>
            <div class="button-action">
              <button class="modify" @click="editTableau(tableau)">
                Modify Quantity
              </button>
              <button
                class="remove-basket"
                @click="removeFromPanier(tableau.id)"
              >
                Delete from basket
              </button>
            </div>
          </div>
          <!-- End of the shop layout  -->
          <!-- Beginning of the shop modify layout  -->
          <div class="content-details fadeIn-top" v-else>
            <h3>{{ tableau.name }} | {{ tableau.painter }}</h3>
            <p>Price: {{ tableau.price * tableau.quantity }} €</p>
            <p>
              Quantity :
              <input type="number" v-model="editingTableau.quantity" />
            </p>
            <div class="button-action">
              <button class="validate" @click="abortEditQuantity()">
                Discard
              </button>
              <button class="add-basket" @click="sendEditQuantity()">
                Confirm
              </button>
            </div>
          </div>
          <!-- End of the shop modify layout  -->
        </div>
      </div>
    </div>
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
      editingTableau: {
        id: -1,
        quantity: 0,
      },
    };
  },
  computed: {
    tableaux_panier() {
      return this.panier.tableaux.map((tableau) => ({
        ...tableau,
        ...this.tableaux.find((a) => a.id === tableau.id),
      }));
    },
  },
  methods: {
    pay() {
      this.$emit("pay");
    },
    removeFromPanier(tableauId) {
      this.$emit("remove-from-panier", tableauId);
    },
    editTableau(tableau) {
      this.editingTableau.id = tableau.id;
      this.editingTableau.quantity = tableau.quantity;
    },
    sendEditQuantity() {
      this.$emit("update-panier", this.editingTableau);
      this.abortEditQuantity();
    },
    abortEditQuantity() {
      this.editingTableau = {
        id: -1,
        quantity: 0,
      };
    },
  },
};
</script>
