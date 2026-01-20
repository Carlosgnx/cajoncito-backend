const { Router } = require('express')
const { getInventories, outboundToVehicle, registerInbound, registerOutbound, getProductStock, adjustInventory } = require('../../controllers/inventory/inventory.controller')

const inventoryRoutes = Router()

//Routes
inventoryRoutes.get('/', getInventories)
inventoryRoutes.patch('/', adjustInventory)
inventoryRoutes.post('/registerInbound', registerInbound)
inventoryRoutes.post('/registerOutbound', registerOutbound)
inventoryRoutes.post('/registerOutboundToVehicle', outboundToVehicle)
inventoryRoutes.get('/getProductStock/:product_id/:storage_id', getProductStock)

module.exports = {
    inventoryRoutes
}
