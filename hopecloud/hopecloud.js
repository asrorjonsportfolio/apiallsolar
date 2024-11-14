module.exports = {
    login: async function (loginWay, loginType, captchaBO, password, userName) {
        let response = await fetch("https://hopewindcloud.eu/api/auth/sysAuth/login", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "applicationid": "1681654280392097797",
                "apptype": "web",
                "appversion": "V0.0.2",
                "browser": "Edge",
                "content-type": "application/json",
                "graytype": "green",
                "lang": "en_US",
                "platform": "Win32",
                "priority": "u=1, i",
                "routerurl": "/login",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "systemtimezone": "+05:00",
                "tenantid": "",
                "token": "",
                "userid": "",
                "Referer": "https://hopewindcloud.eu/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": JSON.stringify({
                loginWay,
                loginType,
                captchaBO,
                password,
                userName
            }),
            "method": "POST"
        });
        return response.json();
    },
    getStationList: async function () {
        let login = await fetch("http://localhost:8080/hopecloud/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loginWay: 1,
                loginType: "pc",
                captchaBO: {},
                password: "22081997Bnpz",
                userName: "BNPZsolar"
            })
        });
        let dataLogin = await login.json();
        let getstationlist = await fetch("https://hopewindcloud.eu/api/device/plantPowerPlantModel/getPowerPlant", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "applicationid": "1681654280392097797",
                "apptype": "web",
                "appversion": "V4.6.0",
                "content-type": "application/json",
                "graytype": "green",
                "lang": "en_US",
                "permissioncode": "HopecloudOpPlantManagePage",
                "priority": "u=1, i",
                "requesthost": "hopewindcloud.eu",
                "routerurl": "/hopecloud/operation-center/plant-manage/index",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "systemtimezone": "+05:00",
                "tenantid": "000001",
                "token": `${dataLogin.msg.result.token}`,
                "userid": `${dataLogin.msg.result.id}`,
                "Referer": "https://hopewindcloud.eu/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{\"plantName\":\"\",\"plantId\":\"\",\"powerPlantType\":\"\",\"organizationId\":\"\",\"ownerId\":\"\",\"webOrder\":\"\",\"addressCode\":[],\"statusList\":[],\"address\":\"\",\"pageSize\":20,\"pageNo\":1}",
            "method": "POST"
        });
        return await getstationlist.json();
    },
    getDeviceList: async function () {
        let login = await fetch("http://localhost:8080/hopecloud/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loginWay: 1,
                loginType: "pc",
                captchaBO: {},
                password: "22081997Bnpz",
                userName: "BNPZsolar"
            })
        });
        let dataLogin = await login.json();
        let getdevicelist = await fetch("https://hopewindcloud.eu/api/device/devDeviceModel/devicePage", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "applicationid": "1681654280392097797",
                "apptype": "web",
                "appversion": "V4.6.0",
                "content-type": "application/json",
                "graytype": "green",
                "lang": "en_US",
                "permissioncode": "HopecloudDeviceListInverterPage",
                "priority": "u=1, i",
                "requesthost": "hopewindcloud.eu",
                "routerurl": "/hopecloud/operation-center/equipment-manage/index",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "systemtimezone": "+05:00",
                "tenantid": "000001",
                "token": `${dataLogin.msg.result.token}`,
                "userid": `${dataLogin.msg.result.id}`,
                "Referer": "https://hopewindcloud.eu/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{\"deviceName\":\"\",\"sn\":\"\",\"pn\":\"\",\"deviceModel\":\"\",\"powerPlantName\":\"\",\"addressCode\":[],\"ownerId\":\"\",\"distributorId\":\"\",\"productTypeCode\":\"\",\"productModelCode\":\"\",\"deviceStatus\":\"\",\"sysVersionDcac\":\"\",\"sysVersionDcdc\":\"\",\"softwareVersionFpga\":\"\",\"paramVersionDcac\":\"\",\"paramVersionDcdc\":\"\",\"pageSize\":20,\"pageNo\":1,\"parentCode\":\"Inverter\"}",
            "method": "POST"
        });
        return await getdevicelist.json();
    },
    getCurrentData1: async function () {
        let login = await fetch("http://localhost:8080/hopecloud/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loginWay: 1,
                loginType: "pc",
                captchaBO: {},
                password: "22081997Bnpz",
                userName: "BNPZsolar"
            })
        });
        let dataLogin = await login.json();
        const response = await fetch("https://hopewindcloud.eu/api/device/devParamGroupByUnitModel/deviceParamTree", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "applicationid": "1681654280392097797",
                "apptype": "web",
                "appversion": "V4.6.0",
                "content-type": "application/json",
                "graytype": "green",
                "lang": "en_US",
                "permissioncode": "HopecloudOpMonitorDeviceDetails",
                "priority": "u=1, i",
                "requesthost": "hopewindcloud.eu",
                "routerurl": "/hopecloud/details/device-details/index",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "systemtimezone": "+05:00",
                "tenantid": "000001",
                "token": `${dataLogin.msg.result.token}`,
                "userid": "1785153445366153218",
                "Referer": "https://hopewindcloud.eu/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{\"dataSourceCode\":\"100\",\"productModelCode\":\"001.000.000\",\"productTypeCode\":\"202\"}",
            "method": "POST"
        });
        return await response.json();
    },
    getDc: async function (deviceSn) {
        let login = await fetch("http://localhost:8080/hopecloud/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loginWay: 1,
                loginType: "pc",
                captchaBO: {},
                password: "22081997Bnpz",
                userName: "BNPZsolar"
            })
        });
        let dataLogin = await login.json();
        let getdc = await fetch("https://hopewindcloud.eu/api/device/devDeviceModel/dcParam", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "applicationid": "1681654280392097797",
                "apptype": "web",
                "appversion": "V4.6.0",
                "content-type": "application/json",
                "graytype": "green",
                "lang": "en_US",
                "permissioncode": "HopecloudOpMonitorDeviceDetails",
                "priority": "u=1, i",
                "requesthost": "hopewindcloud.eu",
                "routerurl": "/hopecloud/details/device-details/index",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "systemtimezone": "+05:00",
                "tenantid": "000001",
                "token": `${dataLogin.msg.result.token}`,
                "userid": `${dataLogin.msg.result.id}`,
                "Referer": "https://hopewindcloud.eu/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": JSON.stringify({
                sn: deviceSn
            }),
            "method": "POST"
        });
        return await getdc.json();
    },
    getAc: async function (deviceSn) {
        let login = await fetch("http://localhost:8080/hopecloud/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loginWay: 1,
                loginType: "pc",
                captchaBO: {},
                password: "22081997Bnpz",
                userName: "BNPZsolar"
            })
        });
        let dataLogin = await login.json();
        let getac = await fetch("https://hopewindcloud.eu/api/device/devDeviceModel/acParam", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "applicationid": "1681654280392097797",
                "apptype": "web",
                "appversion": "V4.6.0",
                "content-type": "application/json",
                "graytype": "green",
                "lang": "en_US",
                "permissioncode": "HopecloudOpMonitorDeviceDetails",
                "priority": "u=1, i",
                "requesthost": "hopewindcloud.eu",
                "routerurl": "/hopecloud/details/device-details/index",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "systemtimezone": "+05:00",
                "tenantid": "000001",
                "token": `${dataLogin.msg.result.token}`,
                "userid": `${dataLogin.msg.result.id}`,
                "Referer": "https://hopewindcloud.eu/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": JSON.stringify({
                sn: deviceSn
            }),
            "method": "POST"
        })
            .catch(error => console.log('err:', error));
        return await getac.json();
    },
    getHistoryData: async function (deviceSn, startTime) {
        let login = await fetch("http://localhost:8080/hopecloud/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loginWay: 1,
                loginType: "pc",
                captchaBO: {},
                password: "22081997Bnpz",
                userName: "BNPZsolar"
            })
        });
        let dataLogin = await login.json();
        let historydata = await fetch("https://hopewindcloud.eu/api/monitor/devDeviceModel/getDeviceParamCurve", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "applicationid": "1681654280392097797",
                "apptype": "web",
                "appversion": "V4.6.0",
                "content-type": "application/json",
                "graytype": "green",
                "lang": "en_US",
                "permissioncode": "HopecloudOpMonitorDeviceDetails",
                "priority": "u=1, i",
                "requesthost": "hopewindcloud.eu",
                "routerurl": "/hopecloud/details/device-details/index",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "systemtimezone": "+05:00",
                "tenantid": "000001",
                "token": `${dataLogin.msg.result.token}`,
                "userid": `${dataLogin.msg.result.id}`,
                "Referer": "https://hopewindcloud.eu/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": JSON.stringify({
                "dataModelParamKeyList": [
                    "ACActivePower"
                ],
                "dateStr": startTime,
                "sn": deviceSn
            }),
            "method": "POST"
        });
        return await historydata.json();
    },
    getUserCustomParamData: async function (deviceSn) {
        let login = await fetch("http://localhost:8080/hopecloud/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loginWay: 1,
                loginType: "pc",
                captchaBO: {},
                password: "22081997Bnpz",
                userName: "BNPZsolar"
            })
        });
        let dataLogin = await login.json();
        let customdata = await fetch("https://hopewindcloud.eu/api/device/devDeviceModel/getUserCustomParamData", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "applicationid": "1681654280392097797",
                "apptype": "web",
                "appversion": "V4.6.0",
                "content-type": "application/json",
                "graytype": "green",
                "lang": "en_US",
                "priority": "u=1, i",
                "requesthost": "hopewindcloud.eu",
                "routerurl": "/hopecloud/details/device-details/index",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "systemtimezone": "+05:00",
                "tenantid": "000001",
                "token": `${dataLogin.msg.result.token}`,
                "userid": `${dataLogin.msg.result.id}`,
                "Referer": "https://hopewindcloud.eu/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": JSON.stringify({
                sn: deviceSn
            }),
            "method": "POST"
        });
        return await customdata.json();
    },
    getCurrentData: async function (deviceSn) {
        let login = await fetch("http://localhost:8080/hopecloud/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loginWay: 1,
                loginType: "pc",
                captchaBO: {},
                password: "22081997Bnpz",
                userName: "BNPZsolar"
            })
        });
        let dataLogin = await login.json();
        let currentData = await fetch("https://hopewindcloud.eu/api/device/devDeviceModel/getParamGroupList", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "applicationid": "1681654280392097797",
                "apptype": "web",
                "appversion": "V4.6.0",
                "content-type": "application/json",
                "graytype": "green",
                "lang": "en_US",
                "permissioncode": "HopecloudOpMonitorDeviceDetails",
                "priority": "u=1, i",
                "requesthost": "hopewindcloud.eu",
                "routerurl": "/hopecloud/details/device-details/index",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "systemtimezone": "+05:00",
                "tenantid": "000001",
                "token": `${dataLogin.msg.result.token}`,
                "userid": `${dataLogin.msg.result.id}`,
                "Referer": "https://hopewindcloud.eu/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": JSON.stringify({
                sn: deviceSn
            }),
            "method": "POST"
        });
        return await currentData.json();
    },
    getPowerCapacityByUserId: async function () {
        let login = await fetch("http://localhost:8080/hopecloud/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loginWay: 1,
                loginType: "pc",
                captchaBO: {},
                password: "22081997Bnpz",
                userName: "BNPZsolar"
            })
        });
        let dataLogin = await login.json();
        let powerCapacity = await fetch("https://hopewindcloud.eu/api/monitor/user/getPowerCapacityByUserId", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "appkeylist": "APP_PVCLOUD",
                "applicationid": "1681654280392097797",
                "apptype": "web",
                "appversion": "V4.7.0",
                "content-type": "application/json",
                "graytype": "green",
                "lang": "en_US",
                "permissioncode": "HopecloudOverview",
                "priority": "u=1, i",
                "requesthost": "hopewindcloud.eu",
                "routerurl": "/hopecloud/overview/index",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "systemtimezone": "+05:00",
                "tenantid": "000001",
                "token": `${dataLogin.msg.result.token}`,
                "userid": `${dataLogin.msg.result.id}`,
                "Referer": "https://hopewindcloud.eu/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": JSON.stringify({
                userId: dataLogin.msg.result.id
            }),
            "method": "POST"
        });
        return await powerCapacity.json();
    }
}