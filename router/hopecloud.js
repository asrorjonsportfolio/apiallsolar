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
routerH.post('/getRealTimeData', async (req, res) => {
    const {sn} = req.body;
    let AC, DC, currentData, deviceList;

    try {
        // Fetch current data
        const currentDataResult = await getCurrentData(sn);
        if (currentDataResult.result.length === 0) {
            res.status(401).send({msg: "deviceSn might be wrong"});
        } else {
            currentData = currentDataResult.result;

            // Fetch AC data
            const acResult = await getAc(sn);
            AC = acResult.result;

            // Fetch DC data
            const dcResult = await getDc(sn);
            DC = dcResult.result;

            // Fetch device list
            const deviceListResult = await getDeviceList();
            deviceList = deviceListResult.result.records;

            // Extract relevant data
            let overview = currentData.find(e => e.i18nKey === "Overview").paramList;
            let info = currentData.find(e => e.i18nKey === "System Information").paramList;
            let alarm = currentData.find(e => e.i18nKey === "Fault alarm").paramList;
            const deviceInfo = deviceList.find(e => e.sn === sn);

            // Send response with data
            res.status(200).send({
                "type": "HOPEWIND",
                "hybrid": false,
                "station_name": `${deviceInfo?.powerPlantName}` || "",
                "station_id": `${deviceInfo?.powerPlantId}` || "",
                "inverter_name": `${deviceInfo?.name}` || "",
                "inverter_sn": `${sn}`,
                "status": `${deviceInfo?.deviceStatus}` || "",
                "power": `${info.find(e => e.paramName === "Rated Power")?.paramValue.slice(0, -2)}` || "0",
                "today_energy": `${overview.find(e => e.paramName === "Today Yield")?.paramValue.slice(0, -3)}` || "0",
                "energy_change": "",
                "date": `${info.find(e => e.paramName === "Current date-time")?.paramValue}` || "",
                "export_energy": `${overview.find(e => e.paramName === "AC active power")?.paramValue.slice(0, -2)}` || "0",
                "import_energy": "0",
                "differ_voltage_ab": `${AC.find(e => e.name === "A-phase")?.voltage}` || "0",
                "differ_voltage_bc": `${AC.find(e => e.name === "B-phase")?.voltage}` || "0",
                "differ_voltage_ac": `${AC.find(e => e.name === "C-phase")?.voltage}` || "0",
                "temperature": `${overview.find(e => e.paramName === "Internal temperature")?.paramValue.slice(0, -2)}` || "0",
                "alarm_code": `${alarm.find(e => e.paramName === "Alarm code")?.paramValue}` || "",
                "pv1": `${DC.find(e => e.mpptName === "MPPT1")?.voltage}` || "0",
                "pv2": `${DC.find(e => e.mpptName === "MPPT2")?.voltage}` || "0",
                "pv3": `${DC.find(e => e.mpptName === "MPPT3")?.voltage}` || "0",
                "pv4": `${DC.find(e => e.mpptName === "MPPT4")?.voltage}` || "0",
                "pv5": `${DC.find(e => e.mpptName === "MPPT5")?.voltage}` || "0",
                "pv6": `${DC.find(e => e.mpptName === "MPPT6")?.voltage}` || "0",
                "pv7": `${DC.find(e => e.mpptName === "MPPT7")?.voltage}` || "0",
                "pv8": `${DC.find(e => e.mpptName === "MPPT8")?.voltage}` || "0",
                "pv9": `${DC.find(e => e.mpptName === "MPPT9")?.voltage}` || "0",
                "pv10": `${DC.find(e => e.mpptName === "MPPT10")?.voltage}` || "0",
                "pv11": `${DC.find(e => e.mpptName === "MPPT11")?.voltage}` || "0",
                "pv12": `${DC.find(e => e.mpptName === "MPPT12")?.voltage}` || "0",
                "total_yield_energy": `${overview.find(e => e.paramName === "Total Yield")?.paramValue.slice(0. - 3)}` || "0",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({msg: 'An error occurred while fetching data', error: error});
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