const express = require("express");
const {getDeviceList, getCurrentData} = require("../foxess/foxess");
const routerF = express.Router();
require("dotenv").config({path: "../.env"});

routerF.post('/getDeviceList', (req, res) => {
    getDeviceList()
        .then(response => res.status(200).send({data: response}))
        .catch(error => res.status(401).send({msg: 'foxess getstationlistmongo error', error}));
});
routerF.post('/getCurrentData', (req, res) => {
    const {deviceSn} = req.body;
    getCurrentData(deviceSn)
        .then(response => res.status(200).send({data: response}))
        .catch(error => res.status(401).send({msg: 'foxess getstationlistmongo error', error}));
});

module.exports = routerF;