<template>
  <div>
    <div class="image-banniere-collection">
            <div class="contenu-banniere-collection">
                <h1><span>Our Collection<span></h1>

                <button class="speed-btn-collection">
                    <router-link to='/panier' id="nav-deco">Go to panier <i class="fas fa-cart-plus"></i></router-link>
                </button>

            </div>
        </div>

        <div class="page" id="page">
            <h1 class="title">Description of the Movement</h1>
            <p>In order to have an overview of what our website has to offer, we have decided to make you discover Asia
                with 2 countries: China and Vietnam. <br>
                The third page will be dedicated to a little game that will allow you to learn some
                famous Asian cities. You can also access to the gallery and other countries with the nav-bar.
            </p>

    <div class="content-collection">
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
