const pool = require('./database');

const injectDbConnection = async (req, res, next) => {
    try {
        req.db = await pool.getConnection();
        next();
    } catch (error) {
        console.error('Error al obtener conexión de la base de datos:', error);
        next(error);
    }
};

module.exports = { injectDbConnection }