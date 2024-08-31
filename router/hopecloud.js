const express = require("express");
const {
    login,
    getDeviceList,
    getStationList,
    getAc,
    getDc,
    getHistoryData,
    getCurrentData, getPowerCapacityByUserId
} = require("../hopecloud/hopecloud");
const routerH = express.Router();
require("dotenv").config({path: "../.env"});

routerH.post('/login', (req, res) => {
    const {loginWay, loginType, captchaBO, password, userName} = req.body;
    login(loginWay, loginType, captchaBO, password, userName)
        .then((response) => {
            res.status(200).send({msg: response});
        })
        .catch(error => res.status(401).send({err: error}));
});
routerH.post('/getStationList', (req, res) => {
    getStationList()
        .then((response) => {
            res.status(200).send({data: response.result.records});
        })
        .catch(error => res.status(401).send({msg: 'hopecloud getstationlist error', error}));
});
routerH.post('/getDeviceList', (req, res) => {
    getDeviceList()
        .then((response) => {
            res.status(200).send({data: response.result});
        })
        .catch(error => res.status(401).send({msg: `hopecloud getdevicelist error`, err: error}));
});
routerH.post('/getAC', (req, res) => {
    const {sn} = req.body;
    getAc(sn)
        .then(async (response) => {
            res.status(200).send({data: response.result});
        })
        .catch(error => res.status(401).send({msg: 'hopecloud getdc error:', error}));
});
routerH.post('/getDC', (req, res) => {
    const {sn} = req.body;
    getDc(sn)
        .then(async (response) => {
            res.status(200).send({data: response.result});
        })
        .catch(error => res.status(401).send({msg: 'hopecloud getdc error:', error}));
});
routerH.post('/getHistoryData', (req, res) => {
    const {deviceSn, startTime} = req.body;
    getHistoryData(deviceSn, startTime)
        .then(response => {
            res.status(200).send({data: response.result.paramListBO})
        })
        .catch(error => console.log('gethistorydata error', error));
});
routerH.post('/getCustomData', (req, res) => {
    const {sn} = req.body;
    getCurrentData(sn)
        .then(response => res.status(200).send({data: response.result}))
        .catch(error => console.log('getusercustomparamdata error', error));
});
routerH.post('/getPowerCapacityByUserId', (req, res) => {
    getPowerCapacityByUserId()
        .then(response => res.status(200).send({data: response.result}))
        .catch(error => console.log('getpowercapacity error', error));
});
routerH.post('/getRealTimeData', (req, res) => {
    const {sn} = req.body;
    let AC;
    let DC;
    let currentData;
    let deviceList;
    try {
        getAc(sn)
            .then(async (result) => {
                AC = result.result;
            })
            .catch(error => res.status(401).send({msg: 'getAC error:', error}))
            .finally(() => {
                getDc(sn)
                    .then(async (result) => {
                        DC = result.result;
                    })
                    .catch(error => res.status(401).send({msg: 'getDC error:', error}))
                    .finally(() => {
                        getCurrentData(sn)
                            .then(async (result) => {
                                currentData = result.result;
                            })
                            .catch(error => res.status(401).send({msg: 'getCurrentData error:', error}))
                            .finally(() => {
                                getDeviceList()
                                    .then(result => deviceList = result.result.records)
                                    .catch(e => console.log(e))
                                    .finally(() => {
                                        try {
                                            let overview = currentData.find(e => e.i18nKey === "Overview").paramList;
                                            let info = currentData.find(e => e.i18nKey === "System Information").paramList;
                                            let alarm = currentData.find(e => e.i18nKey === "Fault alarm").paramList;
                                            res.status(200).send({
                                                "type": "HOPEWIND",
                                                "hybrid": false,
                                                "station_name": deviceList.find(e => e.sn === sn).powerPlantName,
                                                "station_id": deviceList.find(e => e.sn === sn).powerPlantId,
                                                "inverter_name": deviceList.find(e => e.sn === sn).name,
                                                "inverter_sn": sn,
                                                "status": deviceList.find(e => e.sn === sn).deviceStatus,
                                                "power": info.find(e => e.paramName === "Rated Power").paramValue,
                                                "today_energy": overview.find(e => e.paramName === "Today Yield").paramValue,
                                                "energy_change": "",
                                                "date": info.find(e => e.paramName === "Current date-time").paramValue,
                                                "export_energy": overview.find(e => e.paramName === "AC active power").paramValue,
                                                "import_energy": 0,
                                                "differ_voltage_ab": AC.find(e => e.name === "A-phase").voltage,
                                                "differ_voltage_bc": AC.find(e => e.name === "B-phase").voltage,
                                                "differ_voltage_ac": AC.find(e => e.name === "C-phase").voltage,
                                                "temperature": overview.find(e => e.paramName === "Internal temperature").paramValue,
                                                "alarm_code": alarm.find(e => e.paramName === "Alarm code").paramValue,
                                                "pv1": DC.find(e => e.mpptName === "MPPT1").voltage,
                                                "pv2": DC.find(e => e.mpptName === "MPPT2").voltage,
                                                "pv3": DC.find(e => e.mpptName === "MPPT3").voltage,
                                                "pv4": DC.find(e => e.mpptName === "MPPT4").voltage,
                                                "pv5": DC.find(e => e.mpptName === "MPPT5").voltage,
                                                "pv6": DC.find(e => e.mpptName === "MPPT6").voltage,
                                                "pv7": DC.find(e => e.mpptName === "MPPT7").voltage,
                                                "pv8": DC.find(e => e.mpptName === "MPPT8").voltage,
                                                "pv9": DC.find(e => e.mpptName === "MPPT9").voltage,
                                                "pv10": DC.find(e => e.mpptName === "MPPT10").voltage,
                                                "pv11": DC.find(e => e.mpptName === "MPPT11").voltage,
                                                "pv12": DC.find(e => e.mpptName === "MPPT12").voltage,
                                                "total_yield_energy": overview.find(e => e.paramName === "Total Yield").paramValue,
                                                "location_uid": ""
                                            })
                                        } catch (e) {
                                            console.log(e);
                                            res.status(401).send({msg: "deviceSn might be wrong", e});
                                        }
                                    })
                            })
                    });
            });
    } catch (e) {
        console.log(e);
        res.status(401).send({msg: "deviceSn might be wrong", error: e});
    }
});
routerH.post('/getDeviceData', (req, res) => {
    const {stationId} = req.body;
    console.log(stationId)
    let access_token = "";
    try {
        login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
            .then((result) => {
                access_token = result.access_token;
            })
            .catch(error => res.status(401).send(error))
            .finally(() => {
                let deviceList;
                getDeviceList(stationId, access_token)
                    .then(async (result) => {
                        deviceList = result;
                    })
                    .catch(error => res.status(401).send({msg: 'getDeviceList error:', error}))
                    .finally(() => {
                        let json = [];
                        try {
                            deviceList.forEach((device) => {
                                json.push({
                                    "inverter_uuid": device.deviceId,
                                    "serial_number": device.deviceSn,
                                    "status": device.deviceStatus,
                                    "name": device.deviceName,
                                    "power": device.deviceName.match(/\/(\d+)/)[1],
                                    "location_uid": device.stationId,
                                })
                            });
                        } catch (e) {
                            console.log(e);
                            res.status(401).send({msg: 'stationId might be wrong:', e})
                        }
                        res.status(200).send(json)
                    });
            });
    } catch (e) {
        console.log(e);
        res.status(401).send({msg: "stationId might be wrong", e});
    }
});

// routerS.post('/getHistoryDataGlobal', (req, res) => {
//     const {deviceId, startTime, key} = req.body;
//     console.log(req.body);
//     getHistoryDataGlobal(deviceId, access_token, startTime, key)
//         .then(response => res.status(200).send({data: response}))
//         .catch(error => console.log('gethistorydata error', error));
// });
// routerS.post('/getHistoryDataHybrid', (req, res) => {
//     const {deviceId, startTime, key} = req.body;
//     console.log(req.body);
//     getHistoryDataHybrid(deviceId, access_token, startTime, key)
//         .then(response => res.status(200).send({data: response}))
//         .catch(error => console.log('gethistorydata error', error));
// });
// routerS.post('/getCurrentDataMongo', (req, res) => {
//     const {dataSource, database, collection, filter, sort} = req.body;
//     const findConfig = config('POST', 'find', findOne(dataSource, database, collection, filter, sort));
//     callMongo(findConfig)
//         .then(async response => {
//             let data = await response.data;
//             res.status(200).send(data);
//         })
//         .catch(error => res.status(401).send({msg: 'getcurrentdatamongo error', error}));
// });
module.exports = routerH;