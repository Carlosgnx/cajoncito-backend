const { Router } = require('express')
const { getStorages } = require('../../controllers/core/storage.controller')

const storageRoutes = Router()

//Routes
storageRoutes.get('/', getStorages)

module.exports = {
    storageRoutes
}
