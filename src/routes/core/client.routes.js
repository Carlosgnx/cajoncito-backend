const { Router } = require("express")
const { getClients, registerClient } = require("../../controllers/core/client.controller")

const clientRoutes = Router()

clientRoutes.get("/", getClients)
clientRoutes.post("/", registerClient)

module.exports = {
    clientRoutes
}