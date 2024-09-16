const express = require("express");
const {login, getDeviceList} = require("../ung/ung");
const routerU = express.Router();
require("dotenv").config({path: "../.env"});

routerU.post('/getDeviceList', (req, res) => {
    getDeviceList()
        .then(response => res.status(200).send(response))
        .catch(e => console.log(e))
});

module.exports = routerU;