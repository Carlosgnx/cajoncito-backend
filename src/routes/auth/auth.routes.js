const { Router } = require('express')
const { register, login } = require('../../controllers/auth/auth.controller')

const authRoutes = Router()

//Routes
authRoutes.post('/register', register)
authRoutes.post('/login', login)

module.exports = {
    authRoutes
}


