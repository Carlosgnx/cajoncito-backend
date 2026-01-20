async function getVehicles(req, res) {
    try {
        const vehicles = await req.db.query('SELECT id, plate, brand, model FROM vehicles')
        return res.status(200).json({
            data: vehicles
        })
    } catch (error) {
        next(error)
    }
}

async function getVehicleById(req, res) {
    try {
        const { id } = req.params
        const vehicle = await req.db.query('SELECT id, plate, brand, model FROM vehicles WHERE id = ?', [id])
        if (vehicle.length === 0) {
            return res.status(404).json({
                message: 'Vehículo no encontrado'
            })
        }
        return res.status(200).json({
            data: vehicle[0]
        })
    } catch (error) {
        next(error)
    }
}

async function getVehicleByPlate(req, res) {
    try {
        const { plate } = req.params
        const vehicle = await req.db.query('SELECT id, plate, brand, model FROM vehicles WHERE plate = ?', [plate])
        if (vehicle.length === 0) {
            return res.status(404).json({
                message: 'Vehículo no encontrado'
            })
        }
        return res.status(200).json({
            data: vehicle[0]
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getVehicles,
    getVehicleById,
    getVehicleByPlate
}