async function getUsers(req, res, next) {
    try {
        const query = 'SELECT * from users'
        const data = await req.db.query(query)

        res.status(200).json({
            data
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getUsers
}