<template>
  <div id="all">
    
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
              <li><a href="shop.html#/collection" data-after="Service"><i class="fas fa-palette"></i> Collection</a>
              <li><a href="shop.html#/panier" data-after="paintings"><i class="fas fa-shopping-cart" id="here"></i> Panier</a></li>
              <li><a href="shop.html#/login" data-after="paintings"><i class="fas fa-user-alt"></i> Connexion</a></li>
              <li><a href="aboutus.html" data-after="About"><i class="fas fa-gavel" ></i> About</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <div class="image-banniere-panier">
            <div class="contenu-banniere-panier">
                <h1><span>My panier<span></h1>

                <button class="speed-btn-panier">
                    <router-link to='/collection' id="nav-deco">Go back to collection</router-link>
                </button>

            </div>
        </div>

    <article v-for="article in panier.articles" :key="article.id">
      <div class="article-content-panier">
        <div class="article-img">
          <div
            :style="{
              backgroundImage:
                'url(' + articles.find((a) => a.id === article.id).image + ')',
            }"
          ></div>
        </div>
        <h3>
          {{ article.quantity }}
          {{ articles.find((a) => a.id === article.id).name }} | Prix total:
          {{
            articles.find((a) => a.id === article.id).price * article.quantity
          }}€
        </h3>
        <p>{{ articles.find((a) => a.id === article.id).description }}</p>

        <input
          type="number"
          v-model="article.articleQuantity"
          placeholder="Quantité"
        />
        <button @click="putInPanier(article.id, article.articleQuantity)">
          Changer la quantité
        </button>
      </div>
    </article>
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
      articleQuantity: "",
    };
  },
  async mounted() {},
  methods: {
    putInPanier(articleId, articleQuantity) {
      this.$emit("put-in-panier", articleId, articleQuantity);
    },
  },
};
</script>
