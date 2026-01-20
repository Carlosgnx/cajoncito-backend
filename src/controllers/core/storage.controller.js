async function getStorages(req, res) {
    try {
        const storages = await req.db.query('SELECT id, name, address FROM storages');
        return res.status(200).json({
            data: storages
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getStorages
}