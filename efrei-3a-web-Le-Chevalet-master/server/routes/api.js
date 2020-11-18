const express = require('express')
const bcrypt = require('bcrypt')
const { Client } = require('pg')
const router = express.Router()

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'postgrespwd',
  database: 'webproject'
})

client.connect()

class Panier {
  constructor () {
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.tableaux = []
  }
}

// ------------------------------- Aurelien --------------------------------------
router.use((req, res, next) => {
  // l'utilisateur n'est pas reconnu, lui attribuer un panier dans req.session
  if (typeof req.session.panier === 'undefined') {
    req.session.panier = new Panier()
  }
  next()
})

router.route('/panier')
  /*
   * Cette route doit retourner le panier de l'utilisateur, grâce à req.session
   */
  .get((req, res) => {
    res.json(req.session.panier)
  })

  /*
   * Cette route doit ajouter un article au panier, puis retourner le panier modifié à l'utilisateur
   * Le body doit contenir l'id de l'article, ainsi que la quantité voulue
   */
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

/*
 * Cette route doit permettre de confirmer un panier, en recevant le nom et prénom de l'utilisateur
 * Le panier est ensuite supprimé grâce à req.session.destroy()
 */
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

  // si articleId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
  if (isNaN(tableauId)) {
    res.status(400).json({ message: 'articleId should be a number' })
    return
  }
  // on affecte req.articleId pour l'exploiter dans toutes les routes qui en ont besoin
  req.tableauId = tableauId

  const tableau = req.session.panier.tableaux.find(tableau => tableau.id === req.tableauId)
  if (!tableau) {
    res.status(404).json({ message: 'tableau ' + tableauId + ' does not exist' })
    return
  }
  // on affecte req.article pour l'exploiter dans toutes les routes qui en ont besoin
  req.tableau = tableau
  next()
}

router.route('/panier/:tableauId')
  /*
   * Cette route doit permettre de changer la quantité d'un article dans le panier
   * Le body doit contenir la quantité voulue
   */
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

  /*
   * Cette route doit supprimer un article dans le panier
   */
  .delete(parsePanierTableau, (req, res) => {
    const index = req.session.panier.tableaux.indexOf(req.tableau)
    req.session.panier.tableaux.splice(index, 1)
    req.session.panier.updatedAt = new Date()

    res.send()
  })


/**
 * Cette route envoie l'intégralité des articles du site
 */
router.get('/tableaux', async (req, res) => {
  const query = await client.query("SELECT * FROM tableaux")

  res.json(query.rows)
})

/**
 * Cette route crée un article.
 * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
 * NOTE: lorsqu'on redémarre le serveur, l'article ajouté disparait
 *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
 */
router.post('/tableau', async (req, res) => {
  const name = req.body.name
  const painter = req.body.painter
  const movement = req.body.movement
  const date = parseInt(req.body.date)
  const image = req.body.image
  const price = parseInt(req.body.price)

  // vérification de la validité des données d'entrée
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
  // on envoie l'article ajouté à l'utilisateur
  res.json(tableau)
})

/**
 * Cette fonction fait en sorte de valider que l'article demandé par l'utilisateur
 * est valide. Elle est appliquée aux routes:
 * - GET /article/:articleId
 * - PUT /article/:articleId
 * - DELETE /article/:articleId
 * Comme ces trois routes ont un comportement similaire, on regroupe leurs fonctionnalités communes dans un middleware
 */
async function parseTableau(req, res, next) {
  const tableauId = parseInt(req.params.tableauId)

  // si articleId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
  if (isNaN(tableauId)) {
    res.status(400).json({ message: 'articleId should be a number' })
    return
  }
  // on affecte req.articleId pour l'exploiter dans toutes les routes qui en ont besoin
  req.tableauId = tableauId

  const query = await client.query({
    text: "SELECT * FROM tableaux WHERE id = $1 LIMIT 1",
    values: [req.tableauId]
  })

  if (query.rows.length === 0) {
    res.status(404).json({ message: 'tableau ' + tableauId + ' does not exist' })
    return
  }
  // on affecte req.article pour l'exploiter dans toutes les routes qui en ont besoin
  req.tableau = query.rows[0]
  next()
}

router.route('/tableau/:tableauId')
  /**
   * Cette route envoie un article particulier
   */
  .get(parseTableau, (req, res) => {
    // req.article existe grâce au middleware parseArticle
    res.json(req.tableau)
  })

  /**
   * Cette route modifie un article.
   * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
   * NOTE: lorsqu'on redémarre le serveur, la modification de l'article disparait
   *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
   */
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
    }) // remove the article from the database
    res.send()
  })

module.exports = router
