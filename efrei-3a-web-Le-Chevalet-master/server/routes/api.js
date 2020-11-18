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

/**
 * Dans ce fichier, vous trouverez des exemples de requêtes GET, POST, PUT et DELETE
 * Ces requêtes concernent l'ajout ou la suppression d'articles sur le site
 * Votre objectif est, en apprenant des exemples de ce fichier, de créer l'API pour le panier de l'utilisateur
 *
 * Notre site ne contient pas d'authentification, ce qui n'est pas DU TOUT recommandé.
 * De même, les informations sont réinitialisées à chaque redémarrage du serveur, car nous n'avons pas de système de base de données pour faire persister les données
 */

/**
 * Notre mécanisme de sauvegarde des paniers des utilisateurs sera de simplement leur attribuer un panier grâce à req.session, sans authentification particulière
 */
router.use((req, res, next) => {
  // l'utilisateur n'est pas reconnu, lui attribuer un panier dans req.session
  if (typeof req.session.panier === 'undefined') {
    req.session.panier = new Panier()
  }
  next()
})

/*
 * Cette route doit retourner le panier de l'utilisateur, grâce à req.session
 */
router.get('/panier', (req, res) => {
  res.json(req.session.panier)
})

/*
 * Cette route doit ajouter un article au panier, puis retourner le panier modifié à l'utilisateur
 * Le body doit contenir l'id de l'article, ainsi que la quantité voulue
 */
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
      res.status(400).json ({ message: 'bad resquest'})
    }
  }

  const tableau = {
    id: id, 
    quantity: quantity
  }

  req.session.panier.tableaux.push(tableau)
  res.json(req.session.panier)
})

/* Remettre des commentaire */

router.post('/panier/pay', (req, res) => {
  const prenom = req.body.prenom // on recupere le name
  const nom = req.body.nom // we recup the lastname

  if(prenom ==''  || nom ==''){
    res.status(400).json({message:'bad request'})
    return
  }

  res.send("Merci " + prenom +" "+ nom + " pour votre achat")

  req.session.destroy()
  res.json(res.session.panier.tableaux)
  
})


/*
 * Cette route doit permettre de changer la quantité d'un article dans le panier
 * Le body doit contenir la quantité voulue
 */
router.put('/panier/:tableauId', (req, res) => {
  const id = parseInt(req.params.tableauId)
  const quantity = parseInt(req.body.quantity) // we recup the quantity value
  var i = 0

  if(isNaN(id) || (id > tableaux.length || quantity <= 0)){
    res.status(400).json({message:'bad request'})
    return}

    while(i < req.session.panier.tableaux.length && req.session.panier.tableaux[i].id != id){
      i++;
    }

    if(req.session.panier.tableaux[i].id != id){
      res.status(400).json({message: 'bad request'}) // if the id of the article is not found into the articles arrays
      return
    }

    req.session.panier.tableaux[i].quantity = quantity // we change the value quantity
    
    res.json(req.session.panier) // we return the basket

 
})

/*
 * Cette route doit supprimer un article dans le panier
 */

router.delete('/panier/:tableauId', (req, res) => {
  const id = parseInt(req.params.tableauId) // we recup the article id 
  var i = 0

  if(isNaN(id) || (id > tableaux.length)){
    res.status(400).json({message:'bad request'})
    return
  } // we test if not number or not in the articles arrays, there is an error 

  while(i < req.session.panier.tableaux.length && req.session.panier.tableaux[i].id != id){
    i++;
  }
  if(req.session.panier.tableaux[i].id != id){
    res.status(400).json({message: 'bad request'}) // if the id of the article is not found into the articles arrays
    return
  }

  req.session.panier.tableaux.splice(i,1) // we remove the wanted article from the basket

  res.json(req.session.panier) // we return the modified array 
})


/**
 * Cette route envoie l'intégralité des articles du site
 */
router.get('/tableaux', (req, res) => {
  res.json(tableaux)
})

/**
 * Cette route crée un article.
 * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
 * NOTE: lorsqu'on redémarre le serveur, l'article ajouté disparait
 *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
 */
router.post('/tableau', (req, res) => {
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

function parseTableau (req, res, next) {
  const tableauId = parseInt(req.params.tableauId)

  // si articleId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
  if (isNaN(tableauId)) {
    res.status(400).json({ message: 'tableauId should be a number' })
    return
  }
  // on affecte req.articleId pour l'exploiter dans toutes les routes qui en ont besoin
  req.tableauId = tableauId

  const tableau = tableaux.find(a => a.id === req.tableauId)
  if (!tableau) {
    res.status(404).json({ message: 'tableau ' + tableauId + ' does not exist' })
    return
  }
  // on affecte req.article pour l'exploiter dans toutes les routes qui en ont besoin
  req.tableau = tableau
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

    tableaux.splice(index, 1) // remove the article from the array
    res.send()
  })

module.exports = router
