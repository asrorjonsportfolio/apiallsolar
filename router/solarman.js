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
const access_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIwX0JOUFpzb2xhckBnbWFpbC5jb21fMyIsInNjb3BlIjpbImFsbCJdLCJkZXRhaWwiOnsib3JnYW5pemF0aW9uSWQiOjAsInRvcEdyb3VwSWQiOm51bGwsImdyb3VwSWQiOm51bGwsInJvbGVJZCI6LTEsInVzZXJJZCI6MTM2NjkxNjUsInZlcnNpb24iOjEwMDAsImlkZW50aWZpZXIiOiJCTlBac29sYXJAZ21haWwuY29tIiwiaWRlbnRpdHlUeXBlIjozLCJtZGMiOiJGT1JFSUdOXzEiLCJhcHBJZCI6IjMwMjMwOTI2MTQxNjE3MTYifSwiZXhwIjoxNzI3MTU1NDMxLCJtZGMiOiJGT1JFSUdOXzEiLCJhdXRob3JpdGllcyI6WyJhbGwiXSwianRpIjoiOTM4MzZjNTctNTZhMy00YWUxLTlhMjEtZDBmMjY5ODhjOTk2IiwiY2xpZW50X2lkIjoidGVzdCJ9.PVQUtQ6wMllejs8lYm8V6LuhdTVD0X7M9byaqU-H3TFavq2JIWXWcXspyybN3paNb5yJ_3zNH1Em376gjjwlLza_I1rhh0vpAgJx2w6UwwrvulxJVqz7bPlZadFWc29BiHCEwYTrVLDU6-3S3mDd0QM27FXxa-ByiBxaF6N3Vn4414F9s5GRRr7re6cn7OboD5NrMxbuCW76hD2LxLcDHJB2PVv52m0kG6K4fCfyxanlRhgD9QP-U5fBWO-bE-N2K8r2c2W81O4HK9UTxxck-ML3_bCP5jBYz9OCfTJmIDQHjBDrxfnhsQsm_lYPwhWIO9Js5mDhu679B_rH6hEA4Q";
require("dotenv").config({path: "./env.json"});

routerS.post('/login', (req, res) => {
    login(req.body.username, req.body.password, req.body.appSecret)
        .then((result) => {
            const data = {
                "access_token": result.access_token,
                "expires_in": result.expires_in,
                "name": "access_token",
            };
            const Config = config('POST', 'insertOne', insertOne('Cluster0', 'monitoring', 'solarman', data));
            callMongo(Config)
                .catch(error => res.status(401).send(error));
            res.status(200).send(result);
        })
        .catch(error => res.status(401).send(error));
});
routerS.post('/getStationList', (req, res) => {
    const {access_token} = req.body;
    getStationList(access_token)
        .then((response) => {
            console.log(response)
            response.data.map(async (station) => {
                const insertData = {
                    "tags": station.tags,
                    "following": station.following,
                    "entityRel": station.entityRel,
                    "roleCode": station.roleCode,
                    "relatedTime": station.relatedTime,
                    "powerStationVO": station.powerStationVO,
                    "generationMonth": station.generationMonth,
                    "generationYear": station.generationYear,
                    "gridMonth": station.gridMonth,
                    "gridYear": station.gridYear,
                    "gridTotal": station.gridTotal,
                    "useMonth": station.useMonth,
                    "buyMonth": station.buyMonth,
                    "useYear": station.useYear,
                    "buyYear": station.buyYear,
                    "useTotal": station.useTotal,
                    "buyTotal": station.buyTotal,
                    "useUploadTotal": station.useUploadTotal,
                    "gridUploadTotal": station.gridUploadTotal,
                    "buyUploadTotal": station.buyUploadTotal,
                    "incomeMonth": station.incomeMonth,
                    "generationUploadTotalOffset": station.generationUploadTotalOffset,
                    "fullPowerYesterdayHours": station.fullPowerYesterdayHours,
                    "prYesterday": station.prYesterday,
                    "warningStatus": station.warningStatus,
                    "locationAddress": station.locationAddress,
                    "pictureFile": station.pictureFile,
                    "stationImage": station.stationImage,
                    "powerType": station.powerType,
                    "system": station.system,
                    "operating": station.operating,
                    "regionNationId": station.regionNationId,
                    "regionLevel1": station.regionLevel1,
                    "regionLevel2": station.regionLevel2,
                    "regionLevel3": station.regionLevel3,
                    "regionLevel4": station.regionLevel4,
                    "regionLevel5": station.regionLevel5,
                    "regionTimezone": station.regionTimezone,
                    "locationLat": station.locationLat,
                    "locationLng": station.locationLng,
                    "stationImages": station.stationImage,
                    "type": station.type,
                    "id": station.id,
                    "generationValue": station.generationValue,
                    "useValue": station.useValue,
                    "gridValue": station.gridValue,
                    "buyValue": station.buyValue,
                    "incomeValue": station.incomeValue,
                    "fullPowerHoursDay": station.fullPowerHoursDay,
                    "networkStatus": station.networkStatus,
                    "businessWarningStatus": station.businessWarningStatus,
                    "generationCapacity": station.generationCapacity,
                    "installedCapacity": station.installedCapacity,
                    "generationPower": station.generationPower,
                    "createdDate": station.createdDate,
                    "gridInterconnectionType": station.gridInterconnectionType,
                    "generationTotal": station.generationTotal,
                    "templateId": station.templateId,
                    "weather": station.weather,
                    "contactPhone": station.contactPhone,
                    "startOperatingTime": station.startOperatingTime,
                    "consumerWarningStatus": station.consumerWarningStatus,
                    "lastUpdateTime": station.lastUpdateTime,
                    "stationType": station.stationType,
                    "irradiateIntensity": station.irradiateIntensity,
                    "temperature": station.temperature,
                    "installationAzimuthAngle": station.installationAzimuthAngle,
                    "installationTiltAngle": station.installationAzimuthAngle,
                    "usePower": station.usePower,
                    "buyPower": station.buyPower,
                    "gridPower": station.gridPower,
                    "batterySoc": station.batterySoc,
                    "ownerName": station.ownerName,
                    "name": station.name
                };

                const findData = {
                    id: station.id
                };

                const findConfig = config('POST', 'findOne', findOne('Cluster0', 'monitoring', 'solarman', findData));
                const find = await callMongo(findConfig);
                if (find.data.document !== null) {
                    const updateConfig = config('POST', 'updateOne', updateOne('Cluster0', 'monitoring', 'solarman', findData, insertData));
                    callMongo(updateConfig)
                        .then(response => console.log(`${station.name} successfully updated`))
                        .catch(error => res.status(401).send({error}));
                } else {
                    const Config = config('POST', 'insertOne', insertOne('Cluster0', 'monitoring', 'solarman', insertData));
                    callMongo(Config)
                        .then(response => console.log(`${station.name} successfully added`))
                        .catch(error => res.status(401).send({error}));
                }
            });
        })
        .catch(error => res.status(401).send({msg: 'getstationlist error', error}));
    res.status(200).send({msg: 'getstationlist successfully'});
});
routerS.post('/getDeviceList', (req, res) => {
    const {access_token, stationId} = req.body;
    getDeviceList(stationId, access_token)
        .then((response) => {
            response.map(async (inverter) => {
                const data = {
                    collectionTime: inverter.collectionTime,
                    deviceId: inverter.deviceId,
                    deviceName: inverter.deviceName,
                    deviceSn: inverter.deviceSn,
                    deviceStatus: inverter.deviceStatus,
                    deviceType: inverter.deviceType,
                    gatewayId: inverter.gatewayId,
                    gatewaySn: inverter.gatewaySn,
                    generation: inverter.generation,
                    generationPower: inverter.generationPower,
                    generationTotal: inverter.generationTotal,
                    newDevice: inverter.newDevice,
                    productId: inverter.productId,
                    sensor: inverter.sensor,
                    signalIntensity: inverter.signalIntensity,
                    stationId: inverter.stationId,
                    systemId: inverter.systemId,
                    timeZone: inverter.timeZone
                };
                const findData = {
                    deviceSn: inverter.deviceSn
                };
                const findConfig = config('POST', 'findOne', findOne('Cluster0', 'monitoring', `${stationId}`, findData));
                const find = await callMongo(findConfig);

                if (find.data.document !== null) {
                    const updateConfig = config('POST', 'updateOne', updateOne('Cluster0', 'monitoring', `${stationId}`, findData, data));
                    callMongo(updateConfig)
                        .then(response => console.log(`${inverter.deviceName} successfully updated`))
                        .catch(error => res.status(401).send({error}));
                } else {
                    const Config = config('POST', 'insertOne', insertOne('Cluster0', 'monitoring', `${stationId}`, data));
                    callMongo(Config)
                        .then(response => console.log(`${inverter.deviceName} successfully added`))
                        .catch(error => res.status(401).send({error}));
                }
            });
            res.status(200).send({msg: `station ${stationId} inverters successfully added`});
        })
        .catch(error => res.status(401).send({msg: `getdevicelist error`, error}));
});
routerS.post('/getCurrentData', (req, res) => {
    const {deviceSn, access_token} = req.body;
    getCurrentData(deviceSn, access_token)
        .then(async (result) => {
            const dataList = result.dataList;
            console.log(dataList)
            res.status(200).send({msg: dataList});
            // const findData = {deviceSn: result.deviceSn};
            // const findConfig = config('POST', 'findOne', findOne('Cluster0', 'monitoring', `${deviceSn}`, findData));
            // const find = await callMongo(findConfig);
            // if (find.data.document === null) {
            //     dataList.map((record) => {
            //         const data = {
            //             key: record.key,
            //             value: record.value,
            //             unit: record.unit,
            //             name: record.name,
            //             deviceSn: record.deviceSn,
            //             deviceId: record.deviceId
            //         };
            //         const insertConfig = config('POST', 'insertOne', insertOne('Cluster0', 'monitoring', `${deviceSn}`, data));
            //         callMongo(insertConfig)
            //             .then(response => console.log(`${deviceSn} data successfully added`))
            //             .catch(error => res.status(401).send({error}));
            //     });
            // } else {
            //     dataList.map((record) => {
            //         const data = {
            //             key: record.key,
            //             value: record.value,
            //             unit: record.unit,
            //             name: record.name,
            //             deviceSn: record.deviceSn,
            //             deviceId: record.deviceId
            //         };
            //         const filter = {
            //             name: record.name
            //         }
            //         const updateConfig = config('POST', 'updateOne', updateOne('Cluster0', 'monitoring', `${deviceSn}`, filter, data));
            //         callMongo(updateConfig)
            //             .then(response => console.log(`${deviceSn} data successfully updated`))
            //             .catch(error => res.status(401).send({error}));
            //     });
            // }
        })
        .catch(error => res.status(401).send({msg: 'getcurrentdata error:', error}));
});
routerS.post('/getHistoryData', (req, res) => {
    const {deviceSn, timeType, startTime, endTime} = req.body;
    console.log('History', req.body);
    getHistoryData(deviceSn, access_token, timeType, startTime, endTime)
        .then(response => res.status(200).send({data: response.paramDataList}))
        .catch(error => console.log('gethistorydata error', error));
});
routerS.post('/getHistoryDataGlobal', (req, res) => {
    const {deviceId, startTime, key} = req.body;
    console.log(req.body);
    getHistoryDataGlobal(deviceId, access_token, startTime, key)
        .then(response => res.status(200).send({data: response}))
        .catch(error => console.log('gethistorydata error', error));
});
routerS.post('/getHistoryDataHybrid', (req, res) => {
    const {deviceId, startTime, key} = req.body;
    console.log(req.body);
    getHistoryDataHybrid(deviceId, access_token, startTime, key)
        .then(response => res.status(200).send({data: response}))
        .catch(error => console.log('gethistorydata error', error));
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
                console.log(response);
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