async function getClients(req, res) {
    try {
        const clients = await req.db.query('SELECT id, name FROM clients')
        return res.status(200).json({
            data: clients
        })
    } catch (error) {
        next(error)
    }
}

async function registerClient(req, res) {
    try {
        const { name, city, street, number, stands } = req.body
        const client = await req.db.query('INSERT INTO clients (name, city, street, number, stands) VALUES (?,?,?,?,?) RETURNING id', [name, city, street, number, stands])
        return res.status(200).json({
            message: 'Cliente registrado correctamente!',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getClients,
    registerClient
}