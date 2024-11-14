const express = require("express");
const {
    login,
    getDeviceList,
    getStationList,
    getCurrentData,
    getHistoryData, getHistoryDataGlobal, getHistoryDataHybrid
} = require("../solarman/solarman");
const routerS = express.Router();
require("dotenv").config({ path: "../.env" });

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
                    res.status(200).send(response.data);
                })
                .catch(error => res.status(401).send({ msg: 'getstationlist error', error }));
        })
});
routerS.post('/getDeviceList', (req, res) => {
    const { stationId } = req.body;
    let access_token = "";
    login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
        .then((result) => {
            access_token = result.access_token;
        })
        .catch(error => res.status(401).send(error))
        .finally(() => {
            getDeviceList(stationId, access_token)
                .then((response) => {
                    res.status(200).send({ data: response });
                })
                .catch(error => res.status(401).send({ msg: `getdevicelist error`, error }));
        })
});
routerS.post('/getCurrentData', (req, res) => {
    const { deviceSn } = req.body;
    let access_token = "";
    login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
        .then((result) => {
            access_token = result.access_token;
        })
        .catch(error => res.status(401).send(error))
        .finally(() => {
            getCurrentData(deviceSn, access_token)
                .then(async (result) => {
                    res.status(200).send({ msg: result });
                })
                .catch(error => res.status(401).send({ msg: 'getcurrentdata error:', error }));
        })
});
routerS.post('/getHistoryData', (req, res) => {
    const { deviceSn, timeType, startTime, endTime } = req.body;
    let access_token = "";
    login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
        .then((result) => {
            access_token = result.access_token;
        })
        .catch(error => res.status(401).send(error))
        .finally(() => {
            getHistoryData(deviceSn, timeType, startTime, endTime, access_token)
                .then(response => res.status(200).send({ data: response.paramDataList }))
                .catch(error => console.log('gethistorydata error', error));
        })
});
routerS.post('/getHistoryDataGlobal', (req, res) => {
    const { deviceId, startTime, key } = req.body;
    let access_token = "";
    login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
        .then((result) => {
            access_token = result.access_token;
        })
        .catch(error => res.status(401).send(error))
        .finally(() => {
            getHistoryDataGlobal(deviceId, startTime, key, access_token)
                .then(response => res.status(200).send({ data: response }))
                .catch(error => console.log('gethistorydata error', error));
        })
});
routerS.post('/getHistoryDataHybrid', (req, res) => {
    const { deviceId, startTime, key } = req.body;
    let access_token = "";
    login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
        .then((result) => {
            access_token = result.access_token;
        })
        .catch(error => res.status(401).send(error))
        .finally(() => {
            getHistoryDataHybrid(deviceId, startTime, key, access_token)
                .then(response => res.status(200).send({ data: response }))
                .catch(error => console.log('gethistorydata error', error));
        })
});

routerS.post('/getRealTimeData', async (req, res) => {
    const { deviceSn } = req.body;
    console.log(deviceSn);
    let access_token = "";

    try {
        // Get access token
        const loginResult = await login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN);
        access_token = loginResult.access_token;

        // Get current data
        const currentData = await getCurrentData(deviceSn, access_token);
        if (currentData.success === false) {
            res.status(401).send({ msg: currentData.msg });
        } else {
            // Fetch station data by device
            const stationResponse = await fetch("http://localhost:8080/solarman/getStationByDevice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deviceSn })
            });

            const stationData = await stationResponse.json();

            // Extract data from the response
            const { station, hybrid, name: deviceName, status, stationId } = stationData;
            const regex = /Inverter[-\d]*\s+(\w+)\s*\(\d+\)/;
            const typeMatch = deviceName.match(regex);
            const type = typeMatch ? typeMatch[1] : "Unknown";

            // Prepare response data based on hybrid status
            const responseData = {
                "type": type || null,
                "hybrid": hybrid,
                "station_name": `${station}` || null,
                "station_id": `${stationId}` || null,
                "inverter_name": `${deviceName}` || null,
                "inverter_sn": `${deviceSn}` || null,
                "status": `${status}` || null,
                "power": `${parseInt(currentData.dataList.find(e => e.key === "Pr1")?.value) / 1000}` || null,
                "today_energy": `${currentData.dataList.find(e => e.key === "Etdy_ge1")?.value}` || null,
                "date": `${currentData.collectionTime}`,
                "export_energy": hybrid === false ?
                    `${parseInt(currentData.dataList.find(e => e.key === "APo_t1")?.value) / 1000}` || null :
                    `${parseInt(currentData.dataList.find(e => e.key === "INV_O_P_T")?.value) / 1000}` || null,
                "import_energy": hybrid === false ?
                    `${currentData.dataList.find(e => e.key === "Etdy_use1")?.value}` || null :
                    `${currentData.dataList.find(e => e.key === "CT_T_E")?.value}` || null,
                "differ_voltage_ab": `${currentData.dataList.find(e => e.key === "AV1")?.value}` || null,
                "differ_voltage_bc": `${currentData.dataList.find(e => e.key === "AV2")?.value}` || null,
                "differ_voltage_ac": `${currentData.dataList.find(e => e.key === "AV3")?.value}` || null,
                "temperature": hybrid === false ?
                    `${currentData.dataList.find(e => e.key === "T_boost1")?.value}` || null :
                    `${currentData.dataList.find(e => e.key === "AC_T")?.value}` || null,
                "alarm_code": hybrid === false ?
                    `${currentData.dataList.find(e => e.key === "Fault_Code1")?.value}` || null : null,
                "pv1": currentData.dataList.find(e => e.key === "DV1")?.value.toString() || null,
                "pv2": currentData.dataList.find(e => e.key === "DV2")?.value.toString() || null,
                "pv3": currentData.dataList.find(e => e.key === "DV3")?.value.toString() || null,
                "pv4": currentData.dataList.find(e => e.key === "DV4")?.value.toString() || null,
                "pv5": currentData.dataList.find(e => e.key === "DV5")?.value.toString() || null,
                "pv6": currentData.dataList.find(e => e.key === "DV6")?.value.toString() || null,
                "pv7": currentData.dataList.find(e => e.key === "DV7")?.value.toString() || null,
                "pv8": currentData.dataList.find(e => e.key === "DV8")?.value.toString() || null,
                "pv9": currentData.dataList.find(e => e.key === "DV9")?.value.toString() || null,
                "pv10": currentData.dataList.find(e => e.key === "DV10")?.value.toString() || null,
                "pv11": currentData.dataList.find(e => e.key === "DV11")?.value.toString() || null,
                "pv12": currentData.dataList.find(e => e.key === "DV12")?.value.toString() || null,
                "total_yield_energy": `${currentData.dataList.find(e => e.key === "Et_ge0")?.value}` || null,
            };

            // Send the response
            res.status(200).send(responseData);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'An error occurred while fetching data', error });
    }
});

routerS.post('/getDeviceData', (req, res) => {
    try {
        const { stationId } = req.body;
        console.log(stationId)
        let access_token = "";
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
                    .catch(error => res.status(401).send({ msg: 'getDeviceList error:', error }))
                    .finally(() => {
                        try {
                            let json = [];
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
                            res.status(200).send(json)
                        } catch (e) {
                            console.log(e);
                            res.status(401).send({ msg: "stationId might be wrong", e });
                        }
                    });
            });
    } catch (e) {
        console.log(e)
    }
});

routerS.post('/getStationByDevice', (req, res) => {
    try {
        const { deviceSn } = req.body;
        let access_token = "";
        login(process.env.USERNAME_SOLARMAN, process.env.PASSWORD_SOLARMAN, process.env.APP_SECRET_SOLARMAN)
            .then((result) => {
                access_token = result.access_token;
            })
            .catch(error => res.status(401).send(error))
            .finally(() => {
                let stationList;
                let deviceList;
                getStationList(access_token)
                    .then((result) => {
                        stationList = result.data;
                    })
                    .catch(error => res.status(401).send({ msg: 'getDeviceList error:', error }))
                    .finally(() => {
                        try {
                            stationList.forEach((station) => {
                                getDeviceList(station.id, access_token)
                                    .then((result) => {
                                        deviceList = result;
                                        let device = deviceList.find(e => e.deviceSn === deviceSn);
                                        if (device) {
                                            res.status(200).send({
                                                station: station.name,
                                                hybrid: station.gridInterconnectionType === "BATTERY_BACKUP",
                                                name: device.deviceName,
                                                status: device.deviceStatus,
                                                stationId: station.id
                                            });
                                        }
                                    })
                                    .catch(e => console.log(e));
                            })
                            // let json = [];
                            // deviceList.forEach((device) => {
                            //     json.push({
                            //         "inverter_uuid": device.deviceId,
                            //         "serial_number": device.deviceSn,
                            //         "status": device.deviceStatus,
                            //         "name": device.deviceName,
                            //         "power": device.deviceName.match(/\/(\d+)/)[1],
                            //         "location_uid": device.stationId,
                            //     })
                            // });
                            // res.status(200).send()
                        } catch (e) {
                            console.log(e);
                            res.status(401).send({ msg: "stationId might be wrong", error: e });
                        }
                    });
            });
    } catch (e) {
        console.log(e)
    }
});
module.exports = routerS;