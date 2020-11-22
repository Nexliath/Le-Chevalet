const Collection = window.httpVueLoader('./components/Collection.vue')
const Panier = window.httpVueLoader('./components/Panier.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')
const About = window.httpVueLoader('./components/About.vue')

const routes = [ // those are all the routes we use for all website. Except the home page (index.html), all our pages are done with Vue.js 
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
    async loadTableaux() { // used to reload all paintings of the collection page
      try {
        const res = await axios.get('/api/tableaux')
        this.tableaux = res.data
      } catch (e) {
        alert("Error to load the paintings tableaux")
      }
    },
    async loadPanier() { // used to reload the basket (panier) of all paintings
      try {
        const res = await axios.get('/api/panier')
        this.panier = res.data
      } catch (e) {
        alert("Error to load the booking basket.")
      }
    },
    async addTableau(tableau) { // used to add the wanted paintings to the basket
      try {
        const res = await axios.post('/api/tableau', tableau)
        this.tableaux.push(res.data)
      } catch (e) {
        alert("Error to create the painting.")
      }
    },
    async updateTableau(newTableau) { // used to update the informations of wanted painting
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
        alert("Error to modify the painting.")
      }
    },
    async deleteTableau(tableauId) { // used to update the informations of wanted painting
      try {
        await axios.delete('/api/tableau/' + tableauId)
        const index = this.tableaux.findIndex(a => a.id === tableauId)
        this.tableaux.splice(index, 1)
      } catch (e) {
        alert("Error to delete the painting.")
      }
    },
    async addToPanier(tableauId) { // used to add the wanted painting to the basket
      const tableau = {
        id: tableauId,
        quantity: 1
      }
      try {
        const res = await axios.post('/api/panier', tableau)
        this.panier.tableaux.push(tableau)
        this.panier.updatedAt = new Date()
        alert("You have added a painting to your bookings")
      } catch (e) {
        alert("Error to add the painting to bookings.")
      }
    },
    async removeFromPanier(tableauId) { // used to remove the wanted painting from the basket
      try {
        await axios.delete('/api/panier/' + tableauId)
        const index = this.panier.tableaux.findIndex(a => a.id === tableauId)
        this.panier.tableaux.splice(index, 1)
        this.panier.updatedAt = new Date()
      } catch (e) {
        alert("Error to remove the painting from bookings.")
      }
    },
    async updatePanier(newTableau) { // used to add the wanted painting
      try {
        await axios.put('/api/panier/' + newTableau.id, newTableau)
        const tableau = this.panier.tableaux.find(a => a.id === newTableau.id)
        tableau.quantity = newTableau.quantity
        this.panier.updatedAt = new Date()
        this.$forceUpdate() // we reload the vue component
      } catch (e) {
        alert("Error to load painting quantity.")
      }
    },

    // Session login/register/pay/connect

    async pay() {
      try {
        const res = await axios.post('/api/panier/pay')
        this.panier.tableaux.splice(0, this.panier.tableaux.length) // we supress all the paintings of the baskets
        this.panier.updatedAt = new Date()
        alert("Thank you for booking")
      } catch (e) {
        router.push('/login') // redirect to the login page if not connected
        alert("You need to be connected to book")
      }
    },

    async register(credentials) {
      try {
        await axios.post('/api/register', credentials) // we call the register api
        await axios.post('/api/login', credentials) // we call the login api
        await this.loadUser()
        this.$forceUpdate() // we reload the vue component
      } catch (e) {
        alert("Email already taken.")
      }
    },
    async login(credentials) {
      try {
        await axios.post('/api/login', credentials)
        await this.loadUser()
        this.$forceUpdate() // we reload the vue component
      } catch (e) {
        alert("E-mail or password incorrect.")
      }
    },
    async logout() {
      try {
        await axios.post('/api/logout') // we call the logout api
        this.user = null
        this.$forceUpdate() // we reload the vue component
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
