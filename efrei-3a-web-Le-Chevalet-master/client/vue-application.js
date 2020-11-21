const Collection = window.httpVueLoader('./components/Collection.vue')
const Panier = window.httpVueLoader('./components/Panier.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')
const About = window.httpVueLoader('./components/About.vue')
const routes = [
  { path: '/collection', component: Collection },
  { path: '/panier', component: Panier },
  { path: '/register', component: Register},
  { path: '/login', component: Login }, 
  { path: '/about', component: About }, 
]

const router = new VueRouter({
  routes
})

var app = new Vue({
  router,
  el: '#app',
  data: {
    tableaux: [],
    panier: {
      createdAt: null,
      updatedAt: null,
      tableaux: []
    }
  },
  mounted() {
    this.loadTableaux()
    this.loadPanier()
    this.loadUser()
  },
  methods: {
    async loadTableaux() {
      try {
        const res = await axios.get('/api/tableaux')
        this.tableaux = res.data
      } catch (e) {
        alert("Erreur pour charger les tableaux.")
      }
    },
    async loadPanier() {
      try {
        const res = await axios.get('/api/panier')
        this.panier = res.data
      } catch (e) {
        alert("Erreur pour charger le panier.")
      }
    },
    async addTableau(tableau) {
      try {
        const res = await axios.post('/api/tableau', tableau)
        this.tableaux.push(res.data)
      } catch (e) {
        alert("Erreur pour créer le tableau.")
      }
    },
    async updateTableau(newTableau) {
      try {
        await axios.put('/api/tableau/' + newTableau.id, newTableau)
        const tableau = this.tableaux.find(a => a.id === newTableau.id)
        tableau.name = newTableau.name
        tableau.painter = newTableau.painter
        tableau.movement = newTableau.movement
        tableau.date = newTableau.date
        tableau.image = newTableau.image
        tableau.price = newTableau.price
       
      } catch (e) {
        alert("Erreur pour modifier le tableau.")
      }
    },
    async deleteTableau(tableauId) {
      try {
        await axios.delete('/api/tableau/' + tableauId)
        const index = this.tableaux.findIndex(a => a.id === tableauId)
        this.tableaux.splice(index, 1)
      } catch (e) {
        alert("Error to delete the painting.")
      }
    },
    async addToPanier(tableauId) {
      const tableau = {
        id: tableauId,
        quantity: 1
      }
      try {
        const res = await axios.post('/api/panier', tableau)
        this.panier.tableaux.push(tableau)
        this.panier.updatedAt = new Date()
        alert("You have added a paiting to basket")
      } catch (e) {
        alert("Error to add the painting to basket.")
      }
    },
    async removeFromPanier(tableauId) {
      try {
        await axios.delete('/api/panier/' + tableauId)
        const index = this.panier.tableaux.findIndex(a => a.id === tableauId)
        this.panier.tableaux.splice(index, 1)
        this.panier.updatedAt = new Date()
      } catch (e) {
        alert("Error to remove the painting from basket.")
      }
    },
    async updatePanier(newTableau) {
      try {
        await axios.put('/api/panier/' + newTableau.id, newTableau)
        const tableau = this.panier.tableaux.find(a => a.id === newTableau.id)
        tableau.quantity = newTableau.quantity
        this.panier.updatedAt = new Date()
      } catch (e) {
        alert("Error to load painting quantity.")
      }
    },

    // Session login/register/pay/connect

    async pay() {
      try {
        const res = await axios.post('/api/panier/pay')
        this.panier.tableaux.splice(0, this.panier.tableaux.length)
        this.panier.updatedAt = new Date()
      } catch (e) {
        router.push('/login')
      }
    },

    async register(credentials) {
      try {
        await axios.post('/api/register', credentials)
        await axios.post('/api/login', credentials)
        await this.loadUser()
        this.$forceUpdate()
      } catch (e) {
        alert("Email already taken.")
      }
    },
    async login(credentials) {
      try {
        await axios.post('/api/login', credentials)
        await this.loadUser()
        this.$forceUpdate()
      } catch (e) {
        alert("E-mail or password incorrect.")
      }
    },
    async logout() {
      try {
        await axios.post('/api/logout')
        this.user = null
        this.$forceUpdate()
      } catch (e) {
        alert("Not connected.")
      }
    },
    async loadUser() {
      try {
        const res = await axios.get('/api/me')
        this.user = res.data
      } catch (e) {
        this.user = null
      }
    },
  }
})
