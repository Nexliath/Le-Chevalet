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
  async mounted () {
    const res = await axios.get('/api/tableaux')
    this.tableaux = res.data

    const res2 = await axios.get('/api/panier')
    this.panier = res2.data
  },
  methods: {
    async addTableau (tableau) {
      const res = await axios.post('/api/tableau', tableau)
      this.tableaux.push(res.data)
    },

    async addToPanier(tableauId){
      const tableau = {id: tableauId, quantity: 1}
      const res = await axios.post('/api/panier', tableau)

      this.panier = res.data

    },
    async updateTableau (newTableau) {
      await axios.put('/api/tableau/' + newTableau.id, newTableau)
      const tableau = this.tableaux.find(a => a.id === newTableau.id)
      tableau.name = newTableau.name
      tableau.description = newTableau.description
      tableau.image = newTableau.image
      tableau.price = newTableau.price
    },
    async deleteTableau (tableauId) {
      await axios.delete('/api/tableau/' + tableauId)
      const index = this.tableaux.findIndex(a => a.id === tableauId)
      this.tableaux.splice(index, 1)
    },
    async removeFromPanier (tableauId) {
      
      const res = await axios.delete('/api/panier/' + tableauId)
      this.panier = res.data
    },

    async putInPanier (tableauId, tableauQuantity) {
      const test = {id: tableauId, quantity: tableauQuantity}
      const res = await axios.put('/api/panier/'+ tableauId, test)
      this.panier = res.data
    }, 
  }
})
