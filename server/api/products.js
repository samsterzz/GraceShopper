const router = require('express').Router()
const { Product } = require('../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  Product.findAll({ include: [{ all: true }] })
    .then(products => res.json(products))
    .catch(next)
})

router.get('/:productId', (req, res, next) => {
  Product.findById(req.params.productId)
    .then(product => res.json(product))
    .catch(next)
})
