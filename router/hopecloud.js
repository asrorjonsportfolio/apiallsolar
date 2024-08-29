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
    getAc(sn)
        .then(async (result) => {
            AC = result.result;
            console.log(AC)
        })
        .catch(error => res.status(401).send({msg: 'getcurrentdata error:', error}))
        .finally(() => {
            getDc(sn)
                .then(async (result) => {
                    DC = result.result;
                })
                .catch(error => res.status(401).send({msg: 'getcurrentdata error:', error}))
                .finally(() => {
                    getCurrentData(sn)
                        .then(async (result) => {
                            currentData = result.result;
                        })
                        .catch(error => res.status(401).send({msg: 'getcurrentdata error:', error}))
                        .finally(() => {
                            let overview = currentData.find(e => e.i18nKey === "Overview").paramList;
                            let info = currentData.find(e => e.i18nKey === "System Information").paramList;
                            let alarm = currentData.find(e => e.i18nKey === "Fault alarm").paramList;
                            res.status(200).send({
                                "inverter_sn": sn,
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
                                "alarm_code": [alarm.find(e => e.paramName === "Fault code").paramValue,
                                    alarm.find(e => e.paramName === "Alarm code").paramValue],
                                "mppt1": DC.find(e => e.mpptName === "MPPT1").voltage,
                                "mppt2": DC.find(e => e.mpptName === "MPPT2").voltage,
                                "mppt3": DC.find(e => e.mpptName === "MPPT3").voltage,
                                "mppt4": DC.find(e => e.mpptName === "MPPT4").voltage,
                                "mppt5": DC.find(e => e.mpptName === "MPPT5").voltage,
                                "mppt6": DC.find(e => e.mpptName === "MPPT6").voltage,
                                "mppt7": DC.find(e => e.mpptName === "MPPT7").voltage,
                                "mppt8": DC.find(e => e.mpptName === "MPPT8").voltage,
                                "mppt9": DC.find(e => e.mpptName === "MPPT9").voltage,
                                "mppt10": DC.find(e => e.mpptName === "MPPT10").voltage,
                                "mppt11": DC.find(e => e.mpptName === "MPPT11").voltage,
                                "mppt12": DC.find(e => e.mpptName === "MPPT12").voltage,
                                "total_yield_energy": overview.find(e => e.paramName === "Total Yield").paramValue,
                            })
                        })
                });
        });
});
routerH.post('/getDeviceData', (req, res) => {
    const {stationId} = req.body;
    console.log(stationId)
    let access_token = "";
    login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
        .then((result) => {
            access_token = result.access_token;
            console.log(access_token)
        })
        .catch(error => res.status(401).send(error))
        .finally(() => {
            let deviceList;
            getDeviceList(stationId, access_token)
                .then(async (result) => {
                    deviceList = result;
                })
                .catch(error => res.status(401).send({msg: 'getcurrentdata error:', error}))
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
                    }
                    res.status(200).send(json)
                });
        });
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