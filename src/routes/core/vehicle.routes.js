const { Router } = require('express')
const { getVehicles, getVehicleById, getVehicleByPlate } = require('../../controllers/core/vehicle.controller')

const vehicleRoutes = Router()

//Routes
vehicleRoutes.get('/', getVehicles)
vehicleRoutes.get('/:id', getVehicleById)
vehicleRoutes.get('/getVehicleByPlate/:plate', getVehicleByPlate)

module.exports = {
    vehicleRoutes
}
