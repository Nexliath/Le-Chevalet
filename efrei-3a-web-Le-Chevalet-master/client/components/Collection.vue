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
      <article v-for="article in articles" :key="article.id">
        <div class="article-content" v-if="editingArticle.id !== article.id">
          <div class="article-title">
            <div class="article-img">
              <div
                :style="{ backgroundImage: 'url(' + article.image + ')' }"
              ></div>
            </div>

            <h2>{{ article.name }} - {{ article.price }}€</h2>
            <div class="paragraphe">
              {{ article.description }}
            </div>
            <div>
              <button
                class="button"
                v-if="
                  panier.articles.find((a) => a.id === article.id) == undefined
                "
                @click="addToPanier(article.id)"
              >
                Ajouter au panier
              </button>
              <button
                class="button"
                v-else
                @click="removeFromPanier(article.id)"
              >
                Retirer du panier
              </button>

              <button class="button" @click="deleteArticle(article.id)">
                Supprimer
              </button>
              <button class="button" @click="editArticle(article)">
                Modifier
              </button>
            </div>
          </div>
        </div>
        <div class="article-content" v-else>
          <div class="article-title">
            <input
            type="text"
            v-model="editingArticle.image"
            placeholder="Lien vers l'image"
          />
            <h2>
              <input type="text" v-model="editingArticle.name" /> -
              <input type="number" v-model="editingArticle.price" />
            </h2>
            <p><textarea v-model="editingArticle.description"></textarea></p>

            <div>
              <button @click="sendEditArticle()">Valider</button>
              <button @click="abortEditArticle()">Annuler</button>
            </div>
          </div>
        </div>
      </article>
    </div>
    <div class="formulaire">
      <form @submit.prevent="addArticle">
        <h2>Nouveau produit à ajouter</h2>
        <input
          type="text"
          v-model="newArticle.name"
          placeholder="Nom du produit"
          required
        />
        <input
          type="number"
          v-model="newArticle.price"
          placeholder="Prix"
          required
        />
        <textarea
          type="text"
          v-model="newArticle.description"
          placeholder="Description du produit"
          required
        ></textarea>
        <input
          type="text"
          v-model="newArticle.image"
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
    articles: { type: Array, default: [] },
    panier: { type: Object },
  },
  data() {
    return {
      newArticle: {
        name: "",
        description: "",
        image: "",
        price: 0,
      },
      editingArticle: {
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
    addArticle() {
      this.$emit("add-article", this.newArticle);
    },
    addToPanier(articleId) {
      this.$emit("add-to-panier", articleId, this.article);
    },
    removeFromPanier(articleId) {
      this.$emit("remove-from-panier", articleId);
    },
    deleteArticle(articleId) {
      this.$emit("delete-article", articleId);
    },
    editArticle(article) {
      this.editingArticle.id = article.id;
      this.editingArticle.name = article.name;
      this.editingArticle.description = article.description;
      this.editingArticle.image = article.image;
      this.editingArticle.price = article.price;
    },
    sendEditArticle() {
      this.$emit("update-article", this.editingArticle);
      this.abortEditArticle();
    },
    abortEditArticle() {
      this.editingArticle = {
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
