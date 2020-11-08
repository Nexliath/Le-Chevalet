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

    <div class="content-collection" id="content-collection">
      <article v-for="article in articles" :key="article.id">
        <div class="article-content">
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
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    articles: { type: Array, default: [] },
    panier: { type: Object },
  },
  methods: {
    addToPanier(articleId) {
      this.$emit("add-to-panier", articleId, this.article);
    },
    removeFromPanier(articleId) {
      this.$emit("remove-from-panier", articleId);
    },
    deleteArticle(articleId) {
      this.$emit("delete-article", articleId);
    },
  },
};
</script>
