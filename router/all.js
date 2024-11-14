const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const express = require("express");
const routerAll = express.Router();
require("dotenv").config({ path: "../.env" });
// Helper function to create a worker for each device category
function fetchDeviceCategory(category) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, { workerData: { category } });
        
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
}

routerAll.post('/getDeviceList', async (req, res) => {
    try {
        // Use Workers to fetch data concurrently for each category
        const solarmanPromise = fetchDeviceCategory('solarman');
        const hopecloudPromise = fetchDeviceCategory('hopecloud');
        const foxessPromise = fetchDeviceCategory('foxess');
        
        // Await all responses from Workers
        const [solarmanDevices, hopecloudDevices, foxessDevices] = await Promise.all([
            solarmanPromise, hopecloudPromise, foxessPromise
        ]);

        const allDict = {
            solarman: solarmanDevices,
            hopecloud: hopecloudDevices,
            foxess: foxessDevices
        };

        res.status(200).send(allDict);
    } catch (error) {
        console.error("Error fetching device list:", error);
        res.status(500).send({ error: "Failed to fetch device list" });
    }
});

// Worker Code
if (!isMainThread) {
    (async () => {
        const { category } = workerData;

        let devices = [];
        try {
            if (category === 'solarman') {
                // Fetch solarman stations
                const stationResponse = await fetch('http://localhost:8080/solarman/getStationList', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                const solarmanStations = await stationResponse.json();

                // Fetch device lists for each station concurrently
                let devicePromises = solarmanStations.map(async station => {
                    const response = await fetch('http://localhost:8080/solarman/getDeviceList', {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ stationId: station.id })
                    });
                    const devices = await response.json();
                    return devices.data.map(device => device.deviceSn);
                });

                // Wait for all device fetches and flatten results
                devices = (await Promise.all(devicePromises)).flat();

            } else if (category === 'hopecloud') {
                // Fetch hopecloud devices
                const response = await fetch('http://localhost:8080/hopecloud/getDeviceList', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                const deviceList = await response.json();
                devices = deviceList.map(device => device.sn);

            } else if (category === 'foxess') {
                // Fetch foxess devices
                const response = await fetch('http://localhost:8080/foxess/getDeviceList', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                const deviceList = await response.json();
                devices = deviceList.map(device => device.deviceSN);
            }

            parentPort.postMessage(devices); // Send result back to main thread
        } catch (error) {
            console.error(`Error fetching ${category} devices:`, error);
            parentPort.postMessage([]); // Return empty array if there's an error
        }
    })();
}

module.exports = routerAll
