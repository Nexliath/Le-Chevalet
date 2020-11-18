const Collection = window.httpVueLoader('./components/Collection.vue')
const Panier = window.httpVueLoader('./components/Panier.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')

const routes = [
  { path: '/collection', component: Collection },
  { path: '/panier', component: Panier },
  { path: '/register', component: Register},
  { path: '/login', component: Login }, 
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
        alert("Erreur pour supprimer le tableau.")
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
      } catch (e) {
        alert("Erreur pour ajouter le tableau au panier.")
      }
    },
    async removeFromPanier(tableauId) {
      try {
        await axios.delete('/api/panier/' + tableauId)
        const index = this.panier.tableaux.findIndex(a => a.id === tableauId)
        this.panier.tableaux.splice(index, 1)
        this.panier.updatedAt = new Date()
      } catch (e) {
        alert("Erreur pour retirer le tableau du panier.")
      }
    },
    async updatePanier(newTableau) {
      try {
        await axios.put('/api/panier/' + newTableau.id, newTableau)
        const tableau = this.panier.tableaux.find(a => a.id === newTableau.id)
        tableau.quantity = newTableau.quantity
        this.panier.updatedAt = new Date()
      } catch (e) {
        alert("Erreur pour changer la quantité de tableau.")
      }
    },
    async pay() {
      try {
        const res = await axios.post('/api/panier/pay')
        this.panier.tableaux.splice(0, this.panier.tableaux.length)
        this.panier.updatedAt = new Date()
      } catch (e) {
        router.push('/login')
      }
    }
  }
})
