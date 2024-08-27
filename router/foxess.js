const express = require("express");

const {callMongo, config, findOne, updateOne, insertOne} = require("../mongo");
const {getDeviceList, getCurrentData} = require("../foxess/foxess");
const routerF = express.Router();
const token = "76dd21b5-6925-406b-be9c-b6773f053ee8"
require("dotenv").config({path: "../.env"});

routerF.post('/getDeviceList', (req, res) => {
    getDeviceList()
        .then(response => res.status(200).send({data: response}))
        .catch(error => res.status(401).send({msg: 'hopecloud getstationlistmongo error', error}));
});
routerF.post('/getCurrentData', (req, res) => {
    const {deviceSn} = req.body;
    getCurrentData(deviceSn)
        .then(response => res.status(200).send({data: response}))
        .catch(error => res.status(401).send({msg: 'hopecloud getstationlistmongo error', error}));
});

module.exports = routerF;