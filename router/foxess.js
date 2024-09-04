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
routerF.post('/getRealTimeData', async (req, res) => {
    const {deviceSn} = req.body;
    console.log(deviceSn);
    let currentData;
    let deviceList;

    try {
        // Get current data
        const currentDataResult = await getCurrentData(deviceSn);
        if (currentDataResult === null) {
            res.status(401).send({msg: 'deviceSn might be wrong'});
        } else {
            currentData = currentDataResult[0];

            // Get device list
            const deviceListResult = await getDeviceList();
            deviceList = deviceListResult.data;

            // Find device by deviceSn
            const device = deviceList.find(e => e.deviceSN === deviceSn);
            if (!device) {
                return res.status(404).send({msg: 'Device not found', error: 'Invalid deviceSn'});
            }

            // Send response with extracted data
            res.status(200).send({
                "type": "FOXESS",
                "hybrid": device.hasBattery,
                "station_name": `${device.stationName}` || "",
                "station_id": `${device.stationID}` || "",
                "inverter_name": `${device.stationName} FOXESS (25)`,
                "inverter_sn": `${deviceSn}`,
                "status": `${device.status}`,
                "power": "25",
                "today_energy": `${currentData.datas.find(e => e.variable === "todayYield")?.value}` || "0",
                "energy_change": "",
                "date": currentData.time,
                "export_energy": `${currentData.datas.find(e => e.variable === "generationPower")?.value}` || "0",
                "import_energy": "0",
                "differ_voltage_ab": `${currentData.datas.find(e => e.variable === "RVolt")?.value}` || "0",
                "differ_voltage_bc": `${currentData.datas.find(e => e.variable === "SVolt")?.value}` || "0",
                "differ_voltage_ac": `${currentData.datas.find(e => e.variable === "TVolt")?.value}` || "0",
                "temperature": `${currentData.datas.find(e => e.variable === "invTemperation")?.value}` || "0",
                "alarm_code": `${currentData.datas.find(e => e.variable === "currentFault")?.value}` || "",
                "pv1": `${currentData.datas.find(e => e.variable === "pv1Volt")?.value}` || "0",
                "pv2": `${currentData.datas.find(e => e.variable === "pv2Volt")?.value}` || "0",
                "pv3": `${currentData.datas.find(e => e.variable === "pv3Volt")?.value}` || "0",
                "pv4": `${currentData.datas.find(e => e.variable === "pv4Volt")?.value}` || "0",
                "pv5": "",
                "pv6": "",
                "pv7": "",
                "pv8": "",
                "pv9": "",
                "pv10": "",
                "pv11": "",
                "pv12": "",
                "total_yield_energy": `${currentData.datas.find(e => e.variable === "generation")?.value}` || "0",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({msg: 'deviceSn might be wrong', error: error});
    }
});


module.exports = routerF;