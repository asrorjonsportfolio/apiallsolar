const express = require("express");
const {
    login,
    getDeviceList,
    currentData,
    getStationList,
    getCurrentData,
    getHistoryData, getHistoryDataGlobal, getHistoryDataHybrid
} = require("../solarman/solarman");
const {callMongo, config, findOne, updateOne, insertOne} = require("../mongo");
const routerS = express.Router();
require("dotenv").config({path: "../.env"});

routerS.post('/login', (req, res) => {
    login(req.body.username, req.body.password, req.body.appSecret)
        .then((result) => {
            // const data = {
            //     "access_token": result.access_token,
            //     "expires_in": result.expires_in,
            //     "name": "access_token",
            // };
            // const Config = config('POST', 'insertOne', insertOne('Cluster0', 'monitoring', 'solarman', data));
            // callMongo(Config)
            //     .catch(error => res.status(401).send(error));
            res.status(200).send(result);
        })
        .catch(error => res.status(401).send(error));
});
routerS.post('/getStationList', (req, res) => {
    let access_token = "";
    login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
        .then((result) => {
            access_token = result.access_token;
        })
        .catch(error => res.status(401).send(error))
        .finally(() => {
            getStationList(access_token)
                .then((response) => {
                    res.status(200).send({data: response});
                })
                .catch(error => res.status(401).send({msg: 'getstationlist error', error}));
        })
});
routerS.post('/getDeviceList', (req, res) => {
    const {stationId} = req.body;
    let access_token = "";
    login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
        .then((result) => {
            access_token = result.access_token;
        })
        .catch(error => res.status(401).send(error))
        .finally(() => {
            getDeviceList(stationId, access_token)
                .then((response) => {
                    res.status(200).send({data: response});
                })
                .catch(error => res.status(401).send({msg: `getdevicelist error`, error}));
        })
});
routerS.post('/getCurrentData', (req, res) => {
    const {deviceSn} = req.body;
    let access_token = "";
    login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
        .then((result) => {
            access_token = result.access_token;
        })
        .catch(error => res.status(401).send(error))
        .finally(() => {
            getCurrentData(deviceSn, access_token)
                .then(async (result) => {
                    const dataList = result.dataList;
                    res.status(200).send({msg: dataList});
                })
                .catch(error => res.status(401).send({msg: 'getcurrentdata error:', error}));
        })
});
routerS.post('/getHistoryData', (req, res) => {
    const {deviceSn, timeType, startTime, endTime} = req.body;
    let access_token = "";
    login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
        .then((result) => {
            access_token = result.access_token;
        })
        .catch(error => res.status(401).send(error))
        .finally(() => {
            getHistoryData(deviceSn, timeType, startTime, endTime, access_token)
                .then(response => res.status(200).send({data: response.paramDataList}))
                .catch(error => console.log('gethistorydata error', error));
        })
});
routerS.post('/getHistoryDataGlobal', (req, res) => {
    const {deviceId, startTime, key} = req.body;
    let access_token = "";
    login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
        .then((result) => {
            access_token = result.access_token;
        })
        .catch(error => res.status(401).send(error))
        .finally(() => {
            getHistoryDataGlobal(deviceId, startTime, key, access_token)
                .then(response => res.status(200).send({data: response}))
                .catch(error => console.log('gethistorydata error', error));
        })
});
routerS.post('/getHistoryDataHybrid', (req, res) => {
    const {deviceId, startTime, key} = req.body;
    let access_token = "";
    login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
        .then((result) => {
            access_token = result.access_token;
        })
        .catch(error => res.status(401).send(error))
        .finally(() => {
            getHistoryDataHybrid(deviceId, startTime, key, access_token)
                .then(response => res.status(200).send({data: response}))
                .catch(error => console.log('gethistorydata error', error));
        })
});
routerS.post('/getStationListMongo', (req, res) => {
    const {dataSource, database, collection, filter, sort} = req.body;
    const findConfig = config('POST', 'find', findOne(dataSource, database, collection, filter, sort));
    callMongo(findConfig)
        .then(async response => {
            let data = await response.data;
            res.status(200).send(data);
        })
        .catch(error => res.status(401).send({msg: 'getstationlistmongo error', error}));
});
routerS.post('/getDeviceListMongo', (req, res) => {
    const {dataSource, database, collection, filter, sort} = req.body;
    const findConfig = config('POST', 'find', findOne(dataSource, database, collection, filter, sort));
    callMongo(findConfig)
        .then(async response => {
            let data = await response.data;
            res.status(200).send(data);
        })
        .catch(error => res.status(401).send({msg: 'getdevicelistmongo error', error}));
});
routerS.post('/getCurrentDataMongo', (req, res) => {
    const {dataSource, database, collection, filter, sort} = req.body;
    const findConfig = config('POST', 'find', findOne(dataSource, database, collection, filter, sort));
    callMongo(findConfig)
        .then(async response => {
            let data = await response.data;
            res.status(200).send(data);
        })
        .catch(error => res.status(401).send({msg: 'getcurrentdatamongo error', error}));
});
routerS.post('/collectData', (req, res) => {
    const access_token = req.body.access_token;
    let stationList = [];
    const first = () => {
        getStationList(access_token)
            .then((response) => {
                response.data.forEach((station) => {
                    stationList.push(station.id);
                });
                console.log(stationList);
                fetch('http://localhost:8080/solarman/getStationList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        access_token
                    })
                })
                    .then(response => {
                        stationList.forEach((stationId) => {
                            getDeviceList(stationId, access_token)
                                .then((response) => {
                                    console.log(response);
                                    let deviceList = [];
                                    response.forEach((inverter) => {
                                        deviceList.push(inverter.deviceSn);
                                    })
                                    console.log('deviceList: ', deviceList);
                                    fetch('http://localhost:8080/solarman/getDeviceList', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            access_token,
                                            stationId
                                        })
                                    })
                                        .then(response => {
                                            deviceList.forEach((deviceSn) => {
                                                fetch('http://localhost:8080/solarman/getCurrentData', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        access_token,
                                                        deviceSn
                                                    })
                                                })
                                                    .then(async response => await response.json())
                                                    .then(data => console.log(data))
                                                    .catch(error => console.log('collectdata getcurrentdata error:', error));
                                            });
                                            deviceList = [];
                                        })
                                        .catch(error => console.log('collectdata getdevicelist error:', error));
                                })
                        });
                    })
                    .catch(error => console.log('collectdata getstationlist error:', error));
            })
            .catch(error => res.status(401).send({msg: 'getstationlist error', error}));
    }
    first();
});
module.exports = routerS;