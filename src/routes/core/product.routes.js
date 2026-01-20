const { Router } = require('express')
const { getProducts } = require('../../controllers/core/product.controller')

const productRoutes = Router()

//Routes
productRoutes.get('/', getProducts)

module.exports = {
    productRoutes
}
