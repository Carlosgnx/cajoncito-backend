const { Router } = require('express')
const { getVehicleInventories, getProductStockFromVehicle, adjustVehicleInventory } = require('../../controllers/inventory/vehicle-inventory.controller')

const vehicleInventoryRoutes = Router()

//Routes
vehicleInventoryRoutes.get('/', getVehicleInventories)
vehicleInventoryRoutes.get('/getProductStock/:product_id/:vehicle_id', getProductStockFromVehicle)
vehicleInventoryRoutes.patch('/', adjustVehicleInventory)

module.exports = {
    vehicleInventoryRoutes
}