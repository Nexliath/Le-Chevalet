const express = require('express')
const bcrypt = require('bcrypt')
const { Client } = require('pg')
const router = express.Router()

// Access to database
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'postgrespwd', // For the professor, change to your own password
  database: 'webproject', // create a database on pgadmin with the same name (don't forget to backup the 2 tables, tableaux and users)
})

client.connect() // connexion to the database

class Panier {
  constructor () {
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.tableaux = []
  }
}

router.use((req, res, next) => { // create a panier

  if (typeof req.session.panier === 'undefined') {
    req.session.panier = new Panier()
  }
  next()
})

/* ----------------------- BEGIN of Login / Register / Logout / Me / Pay APIs --------------------------------- */

router.post('/register', async (req, res) => { // -> register API
  const email = req.body.email
  const password = req.body.password

  if (typeof email !== 'string' || email === '' || // input verifications
      typeof password !== 'string' || password === '') {
    res.status(400).json({ message: 'bad request' })
    return
  }

  const query = await client.query({
    text: "SELECT * FROM users WHERE email = $1 LIMIT 1",  // we check the email in our database users
    values: [email]
  })

  if (query.rows.length !== 0) { // if the mail is already taken, we return an error message
    res.status(400).json({ message: 'email taken' }) 
    return
  }

  const hash = await bcrypt.hash(password, 10) // we cypher the  password of the user before sending it in our database

  await client.query({
    text: "INSERT INTO users (email, password) VALUES ($1, $2)", // we insert the mail and the cyphered password 
    values: [email, hash]
  })

  res.send() // we send the inserted information to our "users" database
})

router.post('/login', async (req, res) => { // -> login API
  if (req.session.userId !== undefined) {
    res.status(401).json({ message: 'already logged in' })
    return
  }

  const email = req.body.email
  const password = req.body.password

  if (typeof email !== 'string' || email === '' || // input verifications
      typeof password !== 'string' || password === '') {
    res.status(400).json({ message: 'bad request' })
    return
  }

  const query = await client.query({
    text: "SELECT * FROM users WHERE email = $1 LIMIT 1", // we verify in our "users" database if the email exist
    values: [email]
  })

  if (query.rows.length === 0) { // if not, we return an error message
    res.status(400).json({ message: 'incorrect credentials' })
    return
  }

  const user = query.rows[0]
  const valid = await bcrypt.compare(password, user.password) // we verify if the input password is the same as the one in the database

  if (!valid) {
    res.status(400).json({ message: 'incorrect credentials' })
    return
  }

  req.session.userId = user.id

  res.send()
})

router.post('/logout', async (req, res) => { // -> logout API
  if (req.session.userId === undefined) {
    res.status(401).json({ message: 'not logged in' })
    return
  }

  delete req.session.userId // we supress the user session

  res.send()
})

router.get('/me', async (req, res) => { // -> me API
  if (req.session.userId === undefined) {
    res.status(401).json({ message: 'not logged in' })
    return
  }

  const query = await client.query({
    text: "SELECT * FROM users WHERE id = $1 LIMIT 1",
    values: [req.session.userId]
  })

  if (query.rows.length === 0) {
    res.status(400).json({ message: 'user no longer existent' })
    return
  }

  const user = query.rows[0]

  res.json({
    id: user.id,
    email: user.email
  })
})

router.post('/panier/pay', (req, res) => { // -> pay API, only work when the user is connected
  if (req.session.userId === undefined) {
    res.status(401).json({ message: 'not logged in' })
    return
  }

  req.session.panier.tableaux.splice(0, req.session.panier.tableaux.length) // we supress all the paintings inside the basket
  req.session.panier.updatedAt = new Date()
  res.send()
})

/* ----------------------- END of Login / Register / Logout / Me APIs --------------------------------- */

/* ----------------------- BEGIN of all the API linked the basket (=panier) --------------------------- */

router.route('/panier') // we create a  panier instance, which is used to contains all the paintings that the user want to book
  
  .get((req, res) => {
    res.json(req.session.panier)
  })

  .post(async (req, res) => { 
    const id = parseInt(req.body.id)
    const quantity = parseInt(req.body.quantity) // we recup the quantity and the id of the given painting

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
    req.session.panier.tableaux.push(item) // we add the new painting to the basket painting list
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
    const quantity = parseInt(req.body.quantity) // modification of the quantity of the number of the wanted painting inside the basket

    if (isNaN(quantity) || quantity <= 0) {
      res.status(400).json({ message: 'bad request' })
      return
    }

    req.tableau.quantity = quantity // we pass the new quantity 
    req.session.panier.updatedAt = new Date()

    res.send() // and we send the new quantity to our database
  })

  .delete(parsePanierTableau, (req, res) => {
    const index = req.session.panier.tableaux.indexOf(req.tableau)
    req.session.panier.tableaux.splice(index, 1)
    req.session.panier.updatedAt = new Date()

    res.send()
  })

/* ----------------------- END of all the API linked the basket (=panier) --------------------------- */

/* ------------------- BEGIN of all the API linked to the paintings (=tableaux) --------------------- */

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


  if (typeof name !== 'string' || name === '' || // verification
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
 
  res.json(tableau) // we recup this painting
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

  .put(parseTableau, async (req, res) => { // we modify every field that the user have input 
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
    res.send() // we send all the modification to our "tableaux" database
  })

  .delete(parseTableau, async (req, res) => { // we supress the wanted paintings
    await client.query({
      text: "DELETE FROM tableaux WHERE id = $1",
      values: [req.tableauId]
    }) 
    res.send()
  })

  /* ----------------------- END of all the API linked to the paintings (=tableaux) --------------------------- */

module.exports = router
