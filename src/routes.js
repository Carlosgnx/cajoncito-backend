// const { authRoutes } = require('./auth/auth.routes');
// const { inventoryRoutes } = require('./inventory/inventory.routes');
// const { vehicleInventoryRoutes } = require('./inventory/vehicle-inventory.routes');
// const { operatorRoutes } = require('./operador-de-ruta/operador-de-ruta.routes');
// const { storageRoutes } = require('./core/storage.routes');
// const { productRoutes } = require('./core/product.routes');
// const { vehicleRoutes } = require('./core/vehicle.routes');
// const { clientRoutes } = require('./core/client.routes');

const { checkAssistanceRoutes } = require("./routes/check-assistance.routes");
const { userRoutes } = require("./routes/user.routes");


// module.exports = {
//     authRoutes,
//     inventoryRoutes,
//     vehicleInventoryRoutes,
//     operatorRoutes,
//     storageRoutes,
//     productRoutes,
//     vehicleRoutes,
//     clientRoutes
// };



module.exports = {
    checkAssistanceRoutes,
    userRoutes
};