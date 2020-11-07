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
            <h1 class="title">An awesome collection</h1>
            <p>An incredibly comprehensive collection. From impressionism to surrealism through the abstract movement.
                    You will find, we are sure, the painting that suits you. <br>
                Come visit this collection and you will be attracted to the beauty of the talent of our different artists.
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
