const express = require("express");
const {getDeviceList, getCurrentData} = require("../foxess/foxess");
const routerF = express.Router();
require("dotenv").config({path: "../.env"});

routerF.post('/getDeviceList', (req, res) => {
    getDeviceList()
        .then(response => res.status(200).send(response.data))
        .catch(error => res.status(401).send({msg: 'foxess getstationlist error', error}));
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
                "type": "FOXESS" || null,
                "hybrid": device.hasBattery,
                "station_name": `${device.stationName}` || null,
                "station_id": `${device.stationID}` || null,
                "inverter_name": `${device.stationName} FOXESS (25)` || null,
                "inverter_sn": `${deviceSn}` || null,
                "status": `${device.status}` || null,
                "power": "25" || null,
                "today_energy": `${currentData.datas.find(e => e.variable === "todayYield")?.value}` || null,
                "date": `${Math.floor(new Date(currentData.time.slice(0,-9)).getTime() / 1000)}` || null,
                "export_energy": `${currentData.datas.find(e => e.variable === "generationPower")?.value}` || null,
                "import_energy": null,
                "differ_voltage_ab": `${currentData.datas.find(e => e.variable === "RVolt")?.value}` || null,
                "differ_voltage_bc": `${currentData.datas.find(e => e.variable === "SVolt")?.value}` || null,
                "differ_voltage_ac": `${currentData.datas.find(e => e.variable === "TVolt")?.value}` || null,
                "temperature": `${currentData.datas.find(e => e.variable === "invTemperation")?.value}` || null,
                "alarm_code": `${currentData.datas.find(e => e.variable === "currentFault")?.value}` || null,
                "pv1": currentData.datas.find(e => e.variable === "pv1Volt")?.value.toString() || null,
                "pv2": currentData.datas.find(e => e.variable === "pv2Volt")?.value.toString() || null,
                "pv3": currentData.datas.find(e => e.variable === "pv3Volt")?.value.toString() || null,
                "pv4": currentData.datas.find(e => e.variable === "pv4Volt")?.value.toString() || null,
                "pv5": null,
                "pv6": null,
                "pv7": null,
                "pv8": null,
                "pv9": null,
                "pv10": null,
                "pv11": null,
                "pv12": null,
                "total_yield_energy": `${currentData.datas.find(e => e.variable === "generation")?.value}` || null,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({msg: 'deviceSn might be wrong', error: error});
    }
});


module.exports = routerF;
