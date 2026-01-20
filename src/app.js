const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { json } = require('body-parser');
const { verifyToken } = require('./utils/jwt');
const { injectDbConnection } = require('./utils/db_connection');
const { releaseDbConnection } = require('./utils/db_release');

// Importar todas las rutas
const routes = require('./routes');

async function createApp() {
    const app = express();

    // Middlewares básicos
    app.use(cors());
    app.use(json());
    app.use(helmet());
    app.use(morgan('tiny'));

    // Middlewares de base de datos
    app.use(injectDbConnection);
    app.use(releaseDbConnection);

    // Configuración de rutas
    // app.use('/auth', routes.authRoutes);
    // app.use('/inventory', verifyToken, routes.inventoryRoutes);
    // app.use('/vehicle-inventory', verifyToken, routes.vehicleInventoryRoutes);
    // app.use('/operator', verifyToken, routes.operatorRoutes);
    // app.use('/core/storages', verifyToken, routes.storageRoutes);
    // app.use('/core/products', verifyToken, routes.productRoutes);
    // app.use('/core/vehicles', verifyToken, routes.vehicleRoutes);
    // app.use('/core/clients', verifyToken, routes.clientRoutes);
    app.use('/check-assistance', routes.checkAssistanceRoutes);
    app.use('/user', routes.userRoutes);

    // Manejador global de errores
    app.use((error, req, res, next) => {
        if (req.db) req.db.release();
        console.error('Error:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    });

    return app;
}

module.exports = { createApp };