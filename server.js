require('dotenv').config();
const https = require('https');
const fs = require('fs');
const { createApp } = require('./src/app')

const port = 3001;

createApp().then(app => {
    app.listen(port, '0.0.0.0', () => {
        console.log('Server corriendo en el puerto ' + port);
    });
});