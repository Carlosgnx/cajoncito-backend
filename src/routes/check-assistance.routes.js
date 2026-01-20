const { Router } = require('express')
const { registerCheck, registerFaceprint, getFaceprints } = require('../controllers/check-assistance.controller')
const checkAssistanceRoutes = Router()

checkAssistanceRoutes.post('/check', registerCheck)
checkAssistanceRoutes.post('/faceprint', registerFaceprint)
checkAssistanceRoutes.get('/getFaceprints', getFaceprints)

module.exports = {
    checkAssistanceRoutes
};

