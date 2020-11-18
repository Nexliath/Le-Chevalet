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

    <div class="content-collection" id="content-collection">
      <article v-for="tableau in tableaux" :key="tableau.id">
        <div class="article-content" v-if="editingTableau.id !== tableau.id">
          <div class="article-title">
            <div class="article-img">
              <div
                :style="{ backgroundImage: 'url(' + tableau.image + ')' }"
              ></div>
            </div>

            <h2>{{ tableau.name }} - {{ tableau.price }}€</h2>
            <div class="paragraphe">
              {{ tableau.description }}
            </div>
            <div>
              <button
                class="button"
                v-if="
                  panier.tableaux.find((a) => a.id === tableau.id) == undefined
                "
                @click="addToPanier(tableau.id)"
              >
                Ajouter au panier
              </button>
              <button
                class="button"
                v-else
                @click="removeFromPanier(tableau.id)"
              >
                Retirer du panier
              </button>

              <button class="button" @click="deleteTableau(tableau.id)">
                Supprimer
              </button>
              <button class="button" @click="editTableau(tableau)">
                Modifier
              </button>
            </div>
          </div>
        </div>
        <div class="article-content" v-else>
          <div class="article-title">
            <input
            type="text"
            v-model="editingTableau.image"
            placeholder="Lien vers l'image"
          />
            <h2>
              <input type="text" v-model="editingTableau.name" /> -
              <input type="number" v-model="editingTableau.price" />
            </h2>
            <p><textarea v-model="editingTableau.description"></textarea></p>

            <div>
              <button @click="sendEditTableau()">Valider</button>
              <button @click="abortEditTableau()">Annuler</button>
            </div>
          </div>
        </div>
      </article>
    </div>
    <div class="formulaire">
      <form @submit.prevent="addTableau">
        <h2>Nouveau produit à ajouter</h2>
        <input
          type="text"
          v-model="newTableau.name"
          placeholder="Nom du produit"
          required
        />
        <input
          type="number"
          v-model="newTableau.price"
          placeholder="Prix"
          required
        />
        <textarea
          type="text"
          v-model="newTableau.description"
          placeholder="Description du produit"
          required
        ></textarea>
        <input
          type="text"
          v-model="newTableau.image"
          placeholder="Lien vers l'image"
        />
        <button type="submit">Ajouter</button>
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
        description: "",
        image: "",
        price: 0,
      },
      editingTableau: {
        id: -1,
        name: "",
        description: "",
        image: "",
        price: 0,
      },
      isActivated: false,
    };
  },

    methods: {
    addTableau() {
      this.$emit("add-tableau", this.newTableau);
    },
    addToPanier(tableauId) {
      this.$emit("add-to-panier", tableauId, this.tableau);
    },
    removeFromPanier(tableauId) {
      this.$emit("remove-from-panier", tableauId);
    },
    deleteTableau(tableauId) {
      this.$emit("delete-tableau", tableauId);
    },
    editTableau(tableau) {
      this.editingTableau.id = tableau.id;
      this.editingTableau.name = tableau.name;
      this.editingTableau.description = tableau.description;
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
        description: "",
        image: "",
        price: 0,
      };
    },
  },
};
</script>
