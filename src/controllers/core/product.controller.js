async function getProducts(req, res) {
    try {
        const products = await req.db.query('SELECT id, name, price FROM products')
        return res.status(200).json({
            data: products
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getProducts
}