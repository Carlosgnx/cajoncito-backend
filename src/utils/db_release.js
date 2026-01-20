const releaseDbConnection = (req, res, next) => {
    const afterResponse = () => {
        if (req.db) {
            req.db.release();
            console.log('Conexión liberada automáticamente');
        }
        res.off('finish', afterResponse);
    };

    res.on('finish', afterResponse);
    next();
};

module.exports = { releaseDbConnection }