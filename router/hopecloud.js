const express = require("express");
const {
    login,
    getDeviceList,
    getStationList,
    getAc,
    getDc,
    getHistoryData,
    getCurrentData, getUserCustomParamData, getPowerCapacityByUserId
} = require("../hopecloud/hopecloud");
const {callMongo, config, findOne, updateOne, insertOne} = require("../mongo");
const routerH = express.Router();
const access_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIwX0JOUFpzb2xhckBnbWFpbC5jb21fMyIsInNjb3BlIjpbImFsbCJdLCJkZXRhaWwiOnsib3JnYW5pemF0aW9uSWQiOjAsInRvcEdyb3VwSWQiOm51bGwsImdyb3VwSWQiOm51bGwsInJvbGVJZCI6LTEsInVzZXJJZCI6MTM2NjkxNjUsInZlcnNpb24iOjEwMDAsImlkZW50aWZpZXIiOiJCTlBac29sYXJAZ21haWwuY29tIiwiaWRlbnRpdHlUeXBlIjozLCJtZGMiOiJGT1JFSUdOXzEiLCJhcHBJZCI6IjMwMjMwOTI2MTQxNjE3MTYifSwiZXhwIjoxNzI3MTU1NDMxLCJtZGMiOiJGT1JFSUdOXzEiLCJhdXRob3JpdGllcyI6WyJhbGwiXSwianRpIjoiOTM4MzZjNTctNTZhMy00YWUxLTlhMjEtZDBmMjY5ODhjOTk2IiwiY2xpZW50X2lkIjoidGVzdCJ9.PVQUtQ6wMllejs8lYm8V6LuhdTVD0X7M9byaqU-H3TFavq2JIWXWcXspyybN3paNb5yJ_3zNH1Em376gjjwlLza_I1rhh0vpAgJx2w6UwwrvulxJVqz7bPlZadFWc29BiHCEwYTrVLDU6-3S3mDd0QM27FXxa-ByiBxaF6N3Vn4414F9s5GRRr7re6cn7OboD5NrMxbuCW76hD2LxLcDHJB2PVv52m0kG6K4fCfyxanlRhgD9QP-U5fBWO-bE-N2K8r2c2W81O4HK9UTxxck-ML3_bCP5jBYz9OCfTJmIDQHjBDrxfnhsQsm_lYPwhWIO9Js5mDhu679B_rH6hEA4Q";
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
            // response.result.records.forEach(async (station) => {
            //     const insertData = {
            //         status: station.status,
            //         statusName: station.statusName,
            //         name: station.name,
            //         id: station.id,
            //         organizationId: station.organizationId,
            //         organizationName: station.organizationName,
            //         ownerId: station.ownerId,
            //         ownerName: station.ownerName,
            //         powerPlantType: station.powerPlantType,
            //         powerPlantTypeName: station.powerPlantTypeName,
            //         createdTime: station.createdTime,
            //         userKwp: station.userKwp,
            //         groupId: station.groupId,
            //         groupName: station.groupName,
            //         areaCode: station.areaCode,
            //         country: station.country,
            //         province: station.province,
            //         city: station.city,
            //         district: station.district,
            //         countryCode: station.countryCode,
            //         provinceCode: station.provinceCode,
            //         cityCode: station.cityCode,
            //         districtCode: station.districtCode,
            //         address: station.address,
            //         visitor: station.visitor,
            //         area: station.area
            //     };
            //
            //     const findData = {
            //         id: station.id
            //     };
            //
            //     const findConfig = config('POST', 'findOne', findOne('Cluster0', 'monitoring', 'hopecloud', findData));
            //     const find = await callMongo(findConfig);
            //     if (find.data.document !== null) {
            //         const updateConfig = config('POST', 'updateOne', updateOne('Cluster0', 'monitoring', 'hopecloud', findData, insertData));
            //         callMongo(updateConfig)
            //             .then(response => console.log(`${station.name} successfully updated`))
            //             .catch(error => res.status(401).send({err: error}));
            //     } else {
            //         const Config = config('POST', 'insertOne', insertOne('Cluster0', 'monitoring', 'hopecloud', insertData));
            //         callMongo(Config)
            //             .then(response => console.log(`${station.name} successfully added`))
            //             .catch(error => res.status(401).send({err: error}));
            //     }
            // });
        })
        .catch(error => res.status(401).send({msg: 'hopecloud getstationlist error', error}));
});
routerH.post('/getStationListMongo', (req, res) => {
    const {dataSource, database, collection, filter, sort} = req.body;
    const findConfig = config('POST', 'find', findOne(dataSource, database, collection, filter, sort));
    callMongo(findConfig)
        .then(async response => {
            let data = await response.data;
            res.status(200).send({msg: data});
        })
        .catch(error => res.status(401).send({msg: 'hopecloud getstationlistmongo error', error}));
});
routerH.post('/getDeviceList', (req, res) => {
    getDeviceList()
        .then((response) => {
            res.status(200).send({data: response.result});
        })
        .catch(error => res.status(401).send({msg: `hopecloud getdevicelist error`, err: error}));
});
routerH.post('/getDeviceListMongo', (req, res) => {
    const {dataSource, database, collection, filter, sort} = req.body;
    const findConfig = config('POST', 'find', findOne(dataSource, database, collection, filter, sort));
    callMongo(findConfig)
        .then(async response => {
            let data = await response.data;
            res.status(200).send({msg: data});
        })
        .catch(error => res.status(401).send({msg: 'hopecloud getdevicelistmongo error', error}));
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
routerH.post('/collectData', (req, res) => {
    let stationList = [];
    const first = () => {
        getStationList()
            .then(async (response) => {
                const promises = response.result.records.map(async (station) => {
                    const data = {
                        status: station.status,
                        statusName: station.statusName,
                        name: station.name,
                        id: station.id,
                        organizationId: station.organizationId,
                        organizationName: station.organizationName,
                        ownerId: station.ownerId,
                        ownerName: station.ownerName,
                        powerPlantType: station.powerPlantType,
                        powerPlantTypeName: station.powerPlantTypeName,
                        createdTime: station.createdTime,
                        userKwp: station.userKwp,
                        groupId: station.groupId,
                        groupName: station.groupName,
                        areaCode: station.areaCode,
                        country: station.country,
                        province: station.province,
                        city: station.city,
                        district: station.district,
                        countryCode: station.countryCode,
                        provinceCode: station.provinceCode,
                        cityCode: station.cityCode,
                        districtCode: station.districtCode,
                        address: station.address,
                        visitor: station.visitor,
                        area: station.area
                    };
                    const findData = {id: station.id};
                    const findConfig = config('POST', 'findOne', findOne('Cluster0', 'monitoring', 'hopecloud', findData));
                    const find = await callMongo(findConfig);
                    if (find.data.document !== null) {
                        const updateConfig = config('POST', 'updateOne', updateOne('Cluster0', 'monitoring', 'hopecloud', findData, data));
                        return callMongo(updateConfig)
                            .then(response => `${station.name} successfully updated`)
                            .catch(error => {
                                throw new Error(error);
                            });
                    } else {
                        const insertConfig = config('POST', 'insertOne', insertOne('Cluster0', 'monitoring', 'hopecloud', data));
                        return callMongo(insertConfig)
                            .then(response => `${station.name} successfully added`)
                            .catch(error => {
                                throw new Error(error);
                            });
                    }
                });
                try {
                    const results = await Promise.all(promises);
                    results.forEach(result => console.log(result));
                } catch (error) {
                    res.status(401).send({err: error.message});
                } finally {
                    getDeviceList()
                        .then(async (response) => {
                            let deviceList = response.result.records.map((inverter) => inverter.sn)
                            const promises = response.result.records.map(async (inverter) => {
                                const data = {
                                    id: inverter.id,
                                    deviceStatus: inverter.deviceStatus,
                                    deviceStatusName: inverter.deviceStatusName,
                                    name: inverter.name,
                                    sn: inverter.sn,
                                    pn: inverter.pn,
                                    organizationName: inverter.organizationName,
                                    ownerName: inverter.ownerName,
                                    powerPlantName: inverter.powerPlantName,
                                    powerPlantId: inverter.powerPlantId,
                                    productModelCode: inverter.productModelCode,
                                    productTypeCode: inverter.productTypeCode,
                                    productCodeName: inverter.productCodeName,
                                    capacity: inverter.capacity,
                                    batteryCapacity: inverter.batteryCapacity,
                                    userKwp: inverter.userKwp,
                                    cmLoadedNumber: inverter.cmLoadedNumber,
                                    dailyCharge: inverter.dailyCharge,
                                    cumulativeCharge: inverter.cumulativeCharge,
                                    realTimePower: inverter.realTimePower,
                                    ratedPower: inverter.ratedPower,
                                    ratedVoltage: inverter.ratedVoltage,
                                    electricToday: inverter.electricToday,
                                    electricMonth: inverter.electricMonth,
                                    electricYear: inverter.electricYear,
                                    electricTotal: inverter.electricTotal,
                                    runtimeTotal: inverter.runtimeTotal,
                                    activateTime: inverter.activateTime,
                                    createdTime: inverter.createdTime,
                                    expirationTime: inverter.expirationTime,
                                    cmSimNo: inverter.cmSimNo,
                                    cmSysVersion: inverter.cmSysVersion,
                                    softwareVersionApp: inverter.softwareVersionApp,
                                    platformVersion: inverter.platformVersion,
                                    plantLongitude: inverter.plantLongitude,
                                    plantDimension: inverter.plantDimension,
                                    plantAddress: inverter.plantAddress,
                                    communicationProtocolVersion: inverter.communicationProtocolVersion,
                                    sysVersionDcac: inverter.sysVersionDcac,
                                    sysVersionDcdc: inverter.sysVersionDcdc,
                                    softwareVersionFpga: inverter.softwareVersionFpga,
                                    softwareVersionBootloader: inverter.softwareVersionBootloader,
                                    paramVersionDcac: inverter.paramVersionDcac,
                                    paramVersionDcdc: inverter.paramVersionDcdc,
                                    realTimeVoltage: inverter.realTimeVoltage,
                                    realTimeCurrent: inverter.realTimeCurrent,
                                    dataSourceCode: inverter.dataSourceCode,
                                    fullHour: inverter.fullHour,
                                    signalStrength: inverter.signalStrength,
                                    updatedTimestamp: inverter.updatedTimestamp,
                                    onlineNumber: inverter.onlineNumber,
                                    offlineNumber: inverter.offlineNumber,
                                    gridConnected: inverter.gridConnected,
                                    deviceModel: inverter.deviceModel,
                                    currPosTotalActiveErg: inverter.currPosTotalActiveErg,
                                    currReverseTotalActiveErg: inverter.currReverseTotalActiveErg,
                                    todayPosTotalActiveErg: inverter.todayPosTotalActiveErg,
                                    currPosTotalActiveErgInPlant: inverter.currPosTotalActiveErgInPlant,
                                    todayCurrReverseTotalActiveErg: inverter.todayCurrReverseTotalActiveErg,
                                    currReverseTotalActiveErgInPlant: inverter.currReverseTotalActiveErgInPlant,
                                    totalActivePower: inverter.totalActivePower,
                                    arrPlaneIrradiance: inverter.arrPlaneIrradiance,
                                    horizontalIrradiance: inverter.horizontalIrradiance,
                                    obliqueIrradiance: inverter.obliqueIrradiance,
                                    envAirTemp: inverter.envAirTemp,
                                    relativeHumidity: inverter.relativeHumidity,
                                    modelPlaneTemp: inverter.modelPlaneTemp,
                                    windSpeed: inverter.windSpeed,
                                    windDirection: inverter.windDirection,
                                    lowTensionActivePower: inverter.lowTensionActivePower,
                                    highVoltageAphaseProtectionCurrent: inverter.highVoltageAphaseProtectionCurrent,
                                    countryCode: inverter.countryCode,
                                    provinceCode: inverter.provinceCode,
                                    cityCode: inverter.cityCode,
                                    districtCode: inverter.districtCode,
                                    region: inverter.region,
                                    operateTime: inverter.operateTime,
                                    chargingStartTime: inverter.chargingStartTime,
                                    chargingEndTime: inverter.chargingEndTime,
                                    chargedAmount: inverter.chargedAmount,
                                    chargedTime: inverter.chargedTime,
                                    chargingActualVoltage: inverter.chargingActualVoltage,
                                    chargingActualCurrent: inverter.chargingActualCurrent,
                                    chargingActualPower: inverter.chargingActualPower,
                                    customizeDirectPassIdent: inverter.customizeDirectPassIdent,
                                    deviceIconUrl: inverter.deviceIconUrl,
                                    parentCode: inverter.parentCode,
                                    updatedTime: inverter.updatedTime,
                                    aPhaseWindingTemperature: inverter.aPhaseWindingTemperature,
                                    bPhaseWindingTemperature: inverter.bPhaseWindingTemperature,
                                    cPhaseWindingTemperature: inverter.cPhaseWindingTemperature
                                };
                                const findData = {sn: inverter.sn};
                                const findConfig = config('POST', 'findOne', findOne('Cluster0', 'monitoring', `${inverter.powerPlantId}`, findData));
                                const find = await callMongo(findConfig);
                                if (find.data.document !== null) {
                                    const updateConfig = config('POST', 'updateOne', updateOne('Cluster0', 'monitoring', `${inverter.powerPlantId}`, findData, data));
                                    return callMongo(updateConfig)
                                        .then(response => `${inverter.name} successfully updated`)
                                        .catch(error => {
                                            throw new Error(error);
                                        });
                                } else {
                                    const insertConfig = config('POST', 'insertOne', insertOne('Cluster0', 'monitoring', `${inverter.powerPlantId}`, data));
                                    return callMongo(insertConfig)
                                        .then(response => `${inverter.name} successfully added`)
                                        .catch(error => {
                                            throw new Error(error);
                                        });
                                }
                            });

                            const promisegetac = deviceList.map(async (sn) => {
                                return getAc(sn)
                                    .then(async (response) => {
                                        const dataList = response.result;
                                        const findData = {name};
                                        const findConfig = config('POST', 'findOne', findOne('Cluster0', 'monitoring', `${sn}`, findData));
                                        const find = await callMongo(findConfig);
                                        if (find.data.document === null) {
                                            return await dataList.map((record) => {
                                                const data = {
                                                    current: record.current,
                                                    frequency: record.frequency,
                                                    name: record.name,
                                                    voltage: record.voltage,
                                                    sn: sn
                                                };
                                                const insertConfig = config('POST', 'insertOne', insertOne('Cluster0', 'monitoring', `${sn}`, data));
                                                return callMongo(insertConfig)
                                                    .then(response => `${sn} ACdata successfully added`)
                                                    .catch(error => res.status(401).send({error}));
                                            });
                                        } else {
                                            return await dataList.map((record) => {
                                                const data = {
                                                    current: record.current,
                                                    frequency: record.frequency,
                                                    name: record.name,
                                                    voltage: record.voltage,
                                                    sn: sn
                                                };
                                                const filter = {
                                                    name: record.name
                                                }
                                                const updateConfig = config('POST', 'updateOne', updateOne('Cluster0', 'monitoring', `${sn}`, filter, data));
                                                return callMongo(updateConfig)
                                                    .then(response => `${sn} ACdata successfully updated`)
                                                    .catch(error => res.status(401).send({error}));
                                            });
                                        }
                                    })
                                    .catch(error => res.status(401).send({msg: 'hopecloud getac error:', error}));
                            });

                            const promisegetdc = deviceList.map(async (sn) => {
                                return getDc(sn)
                                    .then(async (response) => {
                                        const dataList = response.result;
                                        const findData = {sn};
                                        const findConfig = config('POST', 'findOne', findOne('Cluster0', 'monitoring', `${sn}`, findData));
                                        const find = await callMongo(findConfig);
                                        if (find.data.document === null) {
                                            return await dataList.map((record) => {
                                                const data = {
                                                    current: record.current,
                                                    frequency: record.frequency,
                                                    name: record.name,
                                                    voltage: record.voltage,
                                                    sn: sn
                                                };
                                                const insertConfig = config('POST', 'insertOne', insertOne('Cluster0', 'monitoring', `${sn}`, data));
                                                return callMongo(insertConfig)
                                                    .then(response => `${sn} DCdata successfully added`)
                                                    .catch(error => res.status(401).send({error}));
                                            });
                                        } else {
                                            return await dataList.map((record) => {
                                                const data = {
                                                    current: record.current,
                                                    frequency: record.frequency,
                                                    name: record.name,
                                                    voltage: record.voltage,
                                                    sn: sn
                                                };
                                                const filter = {
                                                    name: record.name
                                                }
                                                const updateConfig = config('POST', 'updateOne', updateOne('Cluster0', 'monitoring', `${sn}`, filter, data));
                                                return callMongo(updateConfig)
                                                    .then(response => `${sn} DCdata successfully updated`)
                                                    .catch(error => res.status(401).send({error}));
                                            });
                                        }
                                    })
                                    .catch(error => res.status(401).send({msg: 'hopecloud getac error:', error}));
                            });

                            try {
                                const results = await Promise.all(promises);
                                const resultsAc = await Promise.all(promisegetac);
                                const resultsDc = await Promise.all(promisegetdc);
                                results.forEach(result => console.log(result));
                                resultsAc.forEach(result => console.log(result));
                                resultsDc.forEach(result => console.log(result));
                                res.status(200).send({msg: 'hopeclooud inverters successfully added'});
                            } catch (error) {
                                res.status(401).send({err: error.message});
                            }
                        })
                        .catch(error => res.status(401).send({msg: 'hopecloud getdevicelist error', err: error}));
                }
            })
            .catch(error => res.status(401).send({msg: 'hopecloud getstationlist error', error}));
        res.status(200).send({msg: 'hopecloud getstationlist successfully'});
    }
    first();
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