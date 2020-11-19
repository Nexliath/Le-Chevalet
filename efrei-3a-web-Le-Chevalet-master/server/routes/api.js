const express = require('express')
const bcrypt = require('bcrypt')
const { Client } = require('pg')
const router = express.Router()

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'viviazerty75018',
  database: 'webproject', 
})

client.connect()

class Panier {
  constructor () {
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.tableaux = []
  }
}


router.use((req, res, next) => {

  if (typeof req.session.panier === 'undefined') {
    req.session.panier = new Panier()
  }
  next()
})

router.route('/panier')
  
  .get((req, res) => {
    res.json(req.session.panier)
  })

  .post(async (req, res) => {
    const id = parseInt(req.body.id)
    const quantity = parseInt(req.body.quantity)

    if (isNaN(id) || id <= 0 ||
      isNaN(quantity) || quantity <= 0 ||
      req.session.panier.tableaux.some(tableau => tableau.id === id)) {
      res.status(400).json({ message: 'bad request' })
      return
    }

    const query = await client.query({
      text: "SELECT * FROM tableaux WHERE id = $1 LIMIT 1",
      values: [id]
    })

    if (query.rows.length === 0) {
      res.status(404).json({ message: 'tableau ' + id + ' does not exist' })
      return
    }

    const item = {
      id,
      quantity
    }
    req.session.panier.tableaux.push(item)
    req.session.panier.updatedAt = new Date()

    res.send()
  })

router.post('/panier/pay', (req, res) => {
  if (req.session.userId === undefined) {
    res.status(401).json({ message: 'not logged in' })
    return
  }

  req.session.panier.tableaux.splice(0, req.session.panier.tableaux.length)
  req.session.panier.updatedAt = new Date()
  res.send()
})

function parsePanierTableau(req, res, next) {
  const tableauId = parseInt(req.params.tableauId)

  if (isNaN(tableauId)) {
    res.status(400).json({ message: 'tableauId should be a number' })
    return
  }
 
  req.tableauId = tableauId

  const tableau = req.session.panier.tableaux.find(tableau => tableau.id === req.tableauId)
  if (!tableau) {
    res.status(404).json({ message: 'tableau ' + tableauId + ' does not exist' })
    return
  }

  req.tableau = tableau
  next()
}

router.route('/panier/:tableauId')

  .put(parsePanierTableau, (req, res) => {
    const quantity = parseInt(req.body.quantity)

    if (isNaN(quantity) || quantity <= 0) {
      res.status(400).json({ message: 'bad request' })
      return
    }

    req.tableau.quantity = quantity
    req.session.panier.updatedAt = new Date()

    res.send()
  })

  .delete(parsePanierTableau, (req, res) => {
    const index = req.session.panier.tableaux.indexOf(req.tableau)
    req.session.panier.tableaux.splice(index, 1)
    req.session.panier.updatedAt = new Date()

    res.send()
  })

router.get('/tableaux', async (req, res) => {
  const query = await client.query("SELECT * FROM tableaux")

  res.json(query.rows)
})


router.post('/tableau', async (req, res) => {
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
      isNaN(date) || date <= 0 || 
      isNaN(price) || price <= 0) {
    res.status(400).json({ message: 'bad request' })
    return
  }

  const query = await client.query({
    text: "INSERT INTO tableaux (name, painter,movement,date, image, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
    values: [name, painter, movement, date, image, price]
  })

  const tableau = {
    id: query.rows[0].id,
    name,
    painter,
    movement,
    date,
    image,
    price
  }
 
  res.json(tableau)
})

async function parseTableau(req, res, next) {
  const tableauId = parseInt(req.params.tableauId)

  if (isNaN(tableauId)) {
    res.status(400).json({ message: 'articleId should be a number' })
    return
  }
  req.tableauId = tableauId

  const query = await client.query({
    text: "SELECT * FROM tableaux WHERE id = $1 LIMIT 1",
    values: [req.tableauId]
  })

  if (query.rows.length === 0) {
    res.status(404).json({ message: 'tableau ' + tableauId + ' does not exist' })
    return
  }

  req.tableau = query.rows[0]
  next()
}

router.route('/tableau/:tableauId')

  .get(parseTableau, (req, res) => {
    res.json(req.tableau)
  })

  .put(parseTableau, async (req, res) => {
    const name = req.body.name
    const painter = req.body.painter
    const movement = req.body.movement
    const date = req.body.date
    const image = req.body.image
    const price = parseInt(req.body.price)

    req.tableau.name = name
    req.tableau.painter = painter
    req.tableau.movement = movement
    req.tableau.date = date
    req.tableau.image = image
    req.tableau.price = price

    const query = await client.query({
      text: "UPDATE tableaux SET name = $1, painter = $2, movement = $3, date = $4, image = $5, price = $6 WHERE id = $7",
      values: [name, painter, movement, date, image, price, req.tableauId]
    })
    res.send()
  })

  .delete(parseTableau, async (req, res) => {
    await client.query({
      text: "DELETE FROM tableaux WHERE id = $1",
      values: [req.tableauId]
    }) 
    res.send()
  })

module.exports = router
