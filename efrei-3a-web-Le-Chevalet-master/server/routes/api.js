const express = require('express')
const router = express.Router()
const tableaux = require('../data/tableaux.js')

class Panier {
  constructor () {
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.tableaux = []
  }
}

// -------------------------------- PANIER ----------------------------------------
router.use((req, res, next) => {
  if (typeof req.session.panier === 'undefined') {
    req.session.panier = new Panier()
  }
  next()
})

// -------------------------------- GET, recuperation ----------------------------------------

router.get('/panier', (req, res) => {
  res.json(req.session.panier)
})


// -------------------------------- POST, Ajout d'un tableau dans le panier ----------------------------------------

router.post('/panier', (req, res) => {
  const id = parseInt(req.body.id) 
  const quantity = parseInt(req.body.quantity)
  
  if (isNaN(id) || id>tableaux.length || 
    isNaN(quantity) || quantity <= 0){
    
    res.status(400).json({ message:'bad request'})
    return
  }
  
  for (var i= 0; i < req.session.panier.tableaux.length; i++){
    if (req.session.panier.tableaux[i].id == id){
      res.status(400).json ({ message: 'bad request'})
    }
  }

  const tableau = {
    id: id, 
    quantity: quantity
  }

  req.session.panier.tableaux.push(tableau)
  res.json(req.session.panier)
})

// -------------------------------- POST, paiement ----------------------------------------
router.post('/panier/pay', (req, res) => {
  const prenom = req.body.prenom 
  const nom = req.body.nom 

  if(prenom ==''  || nom ==''){
    res.status(400).json({message:'bad request'})
    return
  }

  res.send("Merci " + prenom +" "+ nom + " pour votre achat")

  req.session.destroy()
  res.json(res.session.panier.tableaux)
  
})

// -------------------------------- PUT, modification de la quantité d'un tableau se trouvant dans le panier ----------------------------------------

router.put('/panier/:tableauId', (req, res) => {
  const id = parseInt(req.params.tableauId)
  const quantity = parseInt(req.body.quantity)
  var i = 0

  if(isNaN(id) || (id > tableaux.length || quantity <= 0)){
    res.status(400).json({message:'bad request'})
    return}

    while(i < req.session.panier.tableaux.length && req.session.panier.tableaux[i].id != id){
      i++;
    }

    if(req.session.panier.tableaux[i].id != id){
      res.status(400).json({message: 'bad request'})
      return
    }

    req.session.panier.tableaux[i].quantity = quantity 
    
    res.json(req.session.panier) 

 
})

// -------------------------------- DELETE, suppresion d'un tabkeau se trouvant dans le panier ----------------------------------------

router.delete('/panier/:tableauId', (req, res) => {
  const id = parseInt(req.params.tableauId) 
  var i = 0

  if(isNaN(id) || (id > tableaux.length)){
    res.status(400).json({message:'bad request'})
    return
  } 

  while(i < req.session.panier.tableaux.length && req.session.panier.tableaux[i].id != id){
    i++;
  }
  if(req.session.panier.tableaux[i].id != id){
    res.status(400).json({message: 'bad request'}) 
    return
  }

  req.session.panier.tableaux.splice(i,1) 

  res.json(req.session.panier) 
})

// -------------------------------- TABLEAU ----------------------------------------

router.get('/tableaux', (req, res) => {
  res.json(tableaux)
})

router.post('/tableau', (req, res) => {
  const name = req.body.name
  const painter = req.body.painter
  const movement = req.body.movement
  const date = parseInt(req.body.date)
  const image = req.body.image
  const price = parseInt(req.body.price)

  if (typeof name !== 'string' || name === '' ||
      typeof painter !== 'string' || painter === '' ||
      typeof movement !== 'string' || movement === '' ||
      typeof image !== 'string' || image === '' ||
      isNaN(price) || price <= 0 ||
      isNaN(date) || date <= 0) {
    res.status(400).json({ message: 'bad request' })
    return
  }

  const tableau = {
    id: tableaux.length + 1,
    name: name,
    painter: painter,
    movement: movement,
    date: date,
    image: image,
    price: price
  }
  tableaux.push(tableau)
  res.json(tableau)
})

function parseTableau (req, res, next) {
  const tableauId = parseInt(req.params.tableauId)

  if (isNaN(tableauId)) {
    res.status(400).json({ message: 'tableauId should be a number' })
    return
  }
  req.tableauId = tableauId

  const tableau = tableaux.find(a => a.id === req.tableauId)
  if (!tableau) {
    res.status(404).json({ message: 'tableau ' + tableauId + ' does not exist' })
    return
  }
  req.tableau = tableau
  next()
}

router.route('/tableau/:tableauId')
  .get(parseTableau, (req, res) => {
    res.json(req.tableau)
  })

  .put(parseTableau, (req, res) => {
    const name = req.body.name
    const painter = req.body.painter
    const movement = req.body.movement
    const date = parseInt(req.body.date)
    const image = req.body.image
    const price = parseInt(req.body.price)

    req.tableau.name = name
    req.tableau.painter= painter
    req.tableau.movement= movement
    req.tableau.date = date
    req.tableau.image = image
    req.tableau.price = price
    res.send()
  })

  .delete(parseTableau, (req, res) => {
    const index = tableaux.findIndex(a => a.id === req.tableauId)

    tableaux.splice(index, 1) 
    res.send()
  })

module.exports = router
