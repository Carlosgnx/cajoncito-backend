const { Router } = require('express');
const { getUsers } = require('../controllers/user.controller');
const userRoutes = Router()

userRoutes.get('/', getUsers)

module.exports = {
    userRoutes
};

