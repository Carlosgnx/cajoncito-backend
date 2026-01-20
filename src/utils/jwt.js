const jwt = require('jsonwebtoken')

function generateToken(user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '5m' })
}

function verifyToken(req, res, next) {
    let accessToken = req.headers['authorization']
    if (!accessToken) {
        //Si no se ha logeado 
        console.log('No se ha logeado');

        res.status(403).json({
            message: 'No autorizado'
        })
        return
    }
    accessToken = accessToken.split(" ")[1]
    jwt.verify(accessToken, process.env.SECRET, (err, user) => {
        if (err) {
            // Si el token ya expiró
            res.status(401).json({
                message: 'El token es invalido o ya expiró, por favor inicie sesión.'
            })
            return
        } else {
            //Si ya se autenticó
            req.user = user
            next()
        }
    })
}

module.exports = {
    generateToken,
    verifyToken
}