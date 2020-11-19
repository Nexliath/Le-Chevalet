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
          <a href="#services" type="button" class="cta">Take a look</a>
        </div>
      </div>
    </section>
    <!-- collection-cover Section  -->

    <!-- description of the collection  -->
    <section id="services">
      <div class="services container">
        <div class="service-top">
          <h1 class="section-title">A lar<span>g</span>e collection</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum
            deleniti maiores pariatur assumenda quas magni et, doloribus quod
            voluptate quasi molestiae magnam officiis dolorum, dolor provident
            atque molestias voluptatum explicabo!
          </p>
        </div>
      </div>
    </section>
    <!-- End description of the collection  -->

    <div>
      <h1>PAINTING LIST</h1>
      <article v-for="tableau in tableaux" :key="tableau.id">
        <div class="article-img">
          <div
            class="article"
            :style="{ backgroundImage: 'url(' + tableau.image + ')' }"
          ></div>
        </div>
        <div class="article-content" v-if="editingTableau.id !== tableau.id">
          <div class="article-title">
            <h2>
              {{ tableau.name }}, {{ tableau.movement }} - {{ tableau.price }}€
            </h2>
            <p>{{ tableau.painter }}, {{ tableau.date }}</p>
            <div>
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
        </div>
        <div class="article-content" v-else>
          <div class="article-title">
            <h2>
              <input type="text" v-model="editingTableau.name" />,
              <input type="text" v-model="editingTableau.movement"/> -
              <input type="number" v-model="editingTableau.price" />
            </h2>
            <div>
              <button class="add-basket" @click="sendEditTableau()">
                Confirm
              </button>
              <button class="delete" @click="abortEditTableau()">
                Discard
              </button>
            </div>
          </div>
          <p>
            <input type="text" v-model="editingTableau.painter" placeholder="Painter name"/>, 
            <input
            type="number"
            v-model="editingTableau.date"
            placeholder="Date of the tableau"
          />
          </p>
          
          <input
            type="text"
            v-model="editingTableau.image"
            placeholder="Lien vers l'image"
          />
        </div>
      </article>
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
              type="text"
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
      </div>
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


