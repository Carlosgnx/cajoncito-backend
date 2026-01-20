const { Router } = require('express')
const { registerSale, registerLoss, changeVehicle } = require('../../controllers/operador-de-ruta/operador-de-ruta.controller')

const operatorRoutes = Router()

//Routes
operatorRoutes.post('/register-sale', registerSale)
operatorRoutes.post('/register-loss', registerLoss)
operatorRoutes.patch('/change-vehicle', changeVehicle)

module.exports = {
    operatorRoutes
}