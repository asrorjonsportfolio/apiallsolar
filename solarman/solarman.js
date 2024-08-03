const {createHash} = require('crypto');
const {response} = require("express");

module.exports = {
    login: async function (username, password, appSecret) {
        const response = await fetch('https://globalapi.solarmanpv.com/account/v1.0/token?appId=3023092614161716&language=en', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "appSecret": appSecret,
                "username": username,
                "password": createHash('sha256').update(password).digest('hex')
            })
        });
        return await response.json();
    },
    getStationList: async function (token) {
        const response = await fetch("https://globalhome.solarmanpv.com/maintain-s/operating/station/search?order.direction=DESC&order.property=id&page=1&size=20", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "authorization": `Bearer ${token}`,
                "cache-control": "no-cache",
                "content-type": "application/json;charset=UTF-8",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": "_ga=GA1.1.140525135.1717048719; _gcl_au=1.1.1295041529.1717048720; _ga_FHKTLVVX1C=GS1.1.1719479564.13.0.1719479577.0.0.0; language=en; Hm_lvt_d31b40fac8544e512e39ba607467fd1e=1719728204,1719974841,1720149277,1720321977; HMACCOUNT=F5D7B45250026F7C; 0cc559da264288e76f8abee174ab5686=false; 9ac11337b7141049af7c75b907e61cc5=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIwX0JOUFpzb2xhckBnbWFpbC5jb21fMiIsInNjb3BlIjpbImFsbCJdLCJkZXRhaWwiOnsib3JnYW5pemF0aW9uSWQiOjAsInRvcEdyb3VwSWQiOm51bGwsImdyb3VwSWQiOm51bGwsInJvbGVJZCI6LTEsInVzZXJJZCI6MTM2NjkxNjUsInZlcnNpb24iOjEwMDAsImlkZW50aWZpZXIiOiJCTlBac29sYXJAZ21haWwuY29tIiwiaWRlbnRpdHlUeXBlIjoyLCJtZGMiOiJGT1JFSUdOXzEiLCJhcHBJZCI6bnVsbH0sImV4cCI6MTcyNTUwNTk4NSwibWRjIjoiRk9SRUlHTl8xIiwiYXV0aG9yaXRpZXMiOlsiYWxsIl0sImp0aSI6IjI3ZTI3MWEzLWFmOGMtNDI5Ni04ODQ5LTFkZmUzNGNkMGEwNCIsImNsaWVudF9pZCI6InRlc3QifQ.clWVTznRhQNowx0tY7TUb5mJY5IFtrfPu1j83m5qii_J7ymUvOtdv5Z3LI60fsw2RfmwHWGwbOAlHTWtwE-jCpt98Yhuq1asPEZvxaRzs2EwdhwZPlrRUK6Fx8KgSguo8WSgGVlkFPKuS34LT7jNRLgL1WgwXcUGoCyCFVZ42nKm8Nf4IRKEjy6oKH04BY76tO1UhyeIHhUBm-Bwkbt_D1v4WRqO5BsGSctyr5UrHHWG-mJdOMBFpLYn52PX4wl0G0NJTaIHGdxChhkvE0ylUbXnJnBfST0NtyHw-p3G6m7eC1rVl-Bd9O-B_eQp0VGpMgO0shX5TGeyzmjJibfU2Q; 7cf012d25878614523054a695ab82538=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIwX0JOUFpzb2xhckBnbWFpbC5jb21fMiIsInNjb3BlIjpbImFsbCJdLCJhdGkiOiIyN2UyNzFhMy1hZjhjLTQyOTYtODg0OS0xZGZlMzRjZDBhMDQiLCJkZXRhaWwiOnsib3JnYW5pemF0aW9uSWQiOjAsInRvcEdyb3VwSWQiOm51bGwsImdyb3VwSWQiOm51bGwsInJvbGVJZCI6LTEsInVzZXJJZCI6MTM2NjkxNjUsInZlcnNpb24iOjEwMDAsImlkZW50aWZpZXIiOiJCTlBac29sYXJAZ21haWwuY29tIiwiaWRlbnRpdHlUeXBlIjoyLCJtZGMiOiJGT1JFSUdOXzEiLCJhcHBJZCI6bnVsbH0sIm1kYyI6IkZPUkVJR05fMSIsImF1dGhvcml0aWVzIjpbImFsbCJdLCJqdGkiOiJjMDY4YjM2Ny01NDZiLTRjYmUtYTFhZS03YzAxMDg5OWEyYWMiLCJjbGllbnRfaWQiOiJ0ZXN0In0.Yo3VMP4VA2y8O3nRYncQq-lkIl30Mn1AdR7K7aISYTJDKhjJTG3vqjYNuLSAq8_XI_sJTulJuus698lfgObNU6UJZN56hPGd62KJHdOFWc0fPPkjRoOokZWgSdhb5A7dsYd_pvbtBolRbdFn_SdH_nyLymricivVf81o5jSCTbebTiqo8MRKtA3OZ5oRrtlv1SKA3RNmt6PRT6XV7Qb4CLAVHBRq9HXjNdYLPFIbXWGmMb6uca0lfb-x1OR1KDL9FS8RwVj7M952CU80V2MFLpkWk3a5gV-EpcN2-R-fIpNjRQXyDUwb-UJfMKNA9g3EITEGTxvdoJbblTC8pC2GzA; 9c06955b4cc085746da8249e6263562b=email; acw_tc=2a1c56804eec3961b012f6424db82d9a7b96ee01abe2df30ba75e032d2927ef6; Hm_lpvt_d31b40fac8544e512e39ba607467fd1e=1720414954; tfstk=fsP-hNvxXijkvKW3Nz60-ybyUYbcm7Urluz6tDmkdoEYfoil8TrHJkE0XvOoZkcKdoqKKD03RDELmmontTznRoEumJmoqbgp9PE8Z8VL8B3QRk7rxaW0zzlEOGjg914zzEhRzJsmOwabWBu2h1fgzzZ9IgOFswSEd3nKAXMSFsMj02KIO0MCkmgK7p9QAX_YlmueP4MIPrMj5VxSiCL-xUip9JpA9BVRHDRBOS6recUWKBOQM4H8OziYorVxyYntnPpMG7Z0R7Vr3t9xTr2TvJZ1mLm7BVExI8I9wlErRy3Q218tc7ULMYyDSCaxp0ebNxLBOr4bFAwL2gprV8qxQqMXJ1u0jmazN-QeczZi2bgjn1_Tlvw0aAPlcQh_QzcudlsDE0wtRg7_s5EYOhmt-L_AkpJEFq4BnCpr9d6kqqnGoKveLx0qkcbAkpJEFquxjZfDLpkmu",
                "Referer": "https://globalhome.solarmanpv.com/plant/infos/device",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{}",
            "method": "POST"
        });
        return await response.json();
    },
    getDeviceList: async function (stationId, token) {
        const response = await fetch(`https://globalhome.solarmanpv.com/maintain-s/fast/device/${stationId}/device-list?deviceType=INVERTER`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "authorization": `Bearer ${token}`,
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": "_ga=GA1.1.140525135.1717048719; _gcl_au=1.1.1295041529.1717048720; _ga_FHKTLVVX1C=GS1.1.1719479564.13.0.1719479577.0.0.0; language=en; acw_tc=cbeab873a6e6157f901ac078492d9a54b257d15a8636554e2a75d9f5d209bb38; Hm_lvt_d31b40fac8544e512e39ba607467fd1e=1719545001,1719728204,1719974841,1720149277; Hm_lpvt_d31b40fac8544e512e39ba607467fd1e=1720149277; HMACCOUNT=F5D7B45250026F7C; 0cc559da264288e76f8abee174ab5686=false; 9ac11337b7141049af7c75b907e61cc5=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIwX0JOUFpzb2xhckBnbWFpbC5jb21fMiIsInNjb3BlIjpbImFsbCJdLCJkZXRhaWwiOnsib3JnYW5pemF0aW9uSWQiOjAsInRvcEdyb3VwSWQiOm51bGwsImdyb3VwSWQiOm51bGwsInJvbGVJZCI6LTEsInVzZXJJZCI6MTM2NjkxNjUsInZlcnNpb24iOjEwMDAsImlkZW50aWZpZXIiOiJCTlBac29sYXJAZ21haWwuY29tIiwiaWRlbnRpdHlUeXBlIjoyLCJtZGMiOiJGT1JFSUdOXzEiLCJhcHBJZCI6bnVsbH0sImV4cCI6MTcyNTMzMzI4NCwibWRjIjoiRk9SRUlHTl8xIiwiYXV0aG9yaXRpZXMiOlsiYWxsIl0sImp0aSI6IjdmNGY1NGQ4LWZmNDgtNDVhYy05YjIyLWMzYzdiZTQxMGRiNyIsImNsaWVudF9pZCI6InRlc3QifQ.RAIFEuTTBF3oTPk8K4gjNTLX1NixWg-VqMxdP9yCjUL9IawFMISXMVf-00JAn-RrODI9LU0E5lkkMTaKT-gkJoSbPKZUnMf8HCcQe9ZGGrB8YEl7QAaakgCFapLorGVHOKOHdKOk1oT8L31c9FwpsyRw3tt0XyAyYitrnB5UTtQSZrqHj1X_2PMXrd3_FpwC-gpDKYj6VbjkQWncg1dSYXgEcHiedgqPhfFDNQ2B8Npql4ROgfEAsNeR209k7xOEfjD2kM8k6pw5CalS-h84-wCfZfKDHCHsoQaO00Opl7Fm3lWseKJV509bFm4g3Ia2ThWY2J67XkeVmR8jHZtKtQ; 7cf012d25878614523054a695ab82538=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIwX0JOUFpzb2xhckBnbWFpbC5jb21fMiIsInNjb3BlIjpbImFsbCJdLCJhdGkiOiI3ZjRmNTRkOC1mZjQ4LTQ1YWMtOWIyMi1jM2M3YmU0MTBkYjciLCJkZXRhaWwiOnsib3JnYW5pemF0aW9uSWQiOjAsInRvcEdyb3VwSWQiOm51bGwsImdyb3VwSWQiOm51bGwsInJvbGVJZCI6LTEsInVzZXJJZCI6MTM2NjkxNjUsInZlcnNpb24iOjEwMDAsImlkZW50aWZpZXIiOiJCTlBac29sYXJAZ21haWwuY29tIiwiaWRlbnRpdHlUeXBlIjoyLCJtZGMiOiJGT1JFSUdOXzEiLCJhcHBJZCI6bnVsbH0sIm1kYyI6IkZPUkVJR05fMSIsImF1dGhvcml0aWVzIjpbImFsbCJdLCJqdGkiOiIwMzlhODc3Zi0wOWZhLTRlOWUtOWNhOC01YTk2MThjYWFlNWEiLCJjbGllbnRfaWQiOiJ0ZXN0In0.dLXMMSv8OVJRLKSRW0ry-dtIW1TIpBcLZIFI_5CJjMqD2RoY9CNrJO_7TbAmU0Qf23LxKJZ2v_qkeVoWCCMxYdYzOtDw_ycVVs8v_9cprdbtzVCUZ2bm-cWFosOUJ8xA9EnLVMH5k_0w0ViEZIqlOCMzZwZc72_iDOArRv1YEiQFSY05YTorXcKAX16yJLZmJp-H2yjJlyred43XMiB_avjlP7WpPnQwXilY0LTxeCQkQaogWH75Hd0aXK17DqGJc3CvzOdxxqab7l25UL8zBxHP2L8cmBgJ7MF4FsBWyM_-uDK360-52HFAcW7JpoRAoPlQHM-W1Frs8IESh4buFg; 9c06955b4cc085746da8249e6263562b=email; tfstk=f1tr33gSS0nyxFThgssF_XgO15SRiGh_xH1CKpvhF_fkVBOF8BODO_9SeE5HiIDRdLgJ8pvNG31WFgvnLBObA_YWdyReKsKBP9T5TkSJcUZCNbIeKCsE1fisfLpR2Mcs1VRGTBINE7mCtaq0-k4UofisfL4U7tEK1vK4YW5CKMXl-wjm3T6lxTburx5cLOU3-Bjn3KfACTVlr64mmOXZN4Ch1oWNrA2uDO0Kf7bVsLfkOBxm5waJBsPa_n8Vl1m1gkqH0TvvnI6Tb21MW__1sImb4MJcLI76zfryTpv9-Z-UZYOMieRhHEhU818HFFKfkJ4k3H5PS3b4pAsc49Ah8EhafTSWuN-yyvFDEC1ySgpQQb9V7E7OnZ2UrgT6CHQMq0POGNBegNTr_uRG45VdnAKyvUP38aXA31MqnjaJt6ud_tF7JyQJkt5seYULJaXA31Mq3yUdyiBV1YHR.",
                "Referer": "https://globalhome.solarmanpv.com/plant/infos/device",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
        });
        return await response.json();
    },
    getCurrentData: async function (deviceSn, token) {
        const response = await fetch('https://globalapi.solarmanpv.com/device/v1.0/currentData', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "deviceSn": `${deviceSn}`
            })
        });
        return await response.json();
    },
    getHistoryData: async (deviceSn, token, timeType, startTime, endTime) => {
        let response = await fetch(`https://globalapi.solarmanpv.com/device/v1.0/historical`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "endTime": endTime,
                "startTime": startTime,
                "deviceSn": deviceSn,
                "timeType": timeType
            })
        });
        return await response.json();
    },
    getHistoryDataGlobal: async (deviceId, token, startTime, key) => {
        let response = await fetch(`https://globalhome.solarmanpv.com/device-s/device/${deviceId}/stats/day?showParams=${key}&lan=en&day=${startTime}&showParams[]=${key}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "authorization": `Bearer ${token}`,
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": "_ga=GA1.1.140525135.1717048719; _gcl_au=1.1.1295041529.1717048720; _ga_FHKTLVVX1C=GS1.1.1719479564.13.0.1719479577.0.0.0; language=en; tfstk=fHkSeEjfCabSIPnb-7K4CFI85qyIL49aJMZKjDBPv8eRRHgx832EL8kCdri3zJRuTvwIlDCU9U2rdqink3VU88pIOVgcUzLHq6pIJVgQt34UJygEvb-2QdooqJ2KRFJwQi_ddQu5JkepvoE3A6k0ionoqJjmT1v8-0fBZNsWAJ3LHSE_AJCRe2FYMkzAekB8vsKbxrULp7BdDsEzv_EdeyhPOEZDNznWcRIhufLyXNacp9HJZSa6o-Emqxt8ali-FRyih9F7W0UfpFP_oJ4QoAL2Gm0sw4rmRdTbBf0jd5eBFNqSMcwYzRd1G8iqrAw-CU6z0-4u6XFX2LnbFzNgcqIdN8GKrvNoNMxiD83msPVJiEqjUAPQSS_vymoby5GIzEXLzfixl5kVuOytsqMQ6RIyvOz_jbCCc5XQcP-Xc6fE1OD_2WVK1PP8mokwcn_5t7E0cP-Xc6f3woq4_ntfP6f..; Hm_lvt_d31b40fac8544e512e39ba607467fd1e=1721291481,1721497306,1721822236,1721945086; HMACCOUNT=F5D7B45250026F7C; 0cc559da264288e76f8abee174ab5686=false; 9ac11337b7141049af7c75b907e61cc5=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIwX0JOUFpzb2xhckBnbWFpbC5jb21fMiIsInNjb3BlIjpbImFsbCJdLCJkZXRhaWwiOnsib3JnYW5pemF0aW9uSWQiOjAsInRvcEdyb3VwSWQiOm51bGwsImdyb3VwSWQiOm51bGwsInJvbGVJZCI6LTEsInVzZXJJZCI6MTM2NjkxNjUsInZlcnNpb24iOjEwMDAsImlkZW50aWZpZXIiOiJCTlBac29sYXJAZ21haWwuY29tIiwiaWRlbnRpdHlUeXBlIjoyLCJtZGMiOiJGT1JFSUdOXzEiLCJhcHBJZCI6bnVsbH0sImV4cCI6MTcyNzEyOTA5MiwibWRjIjoiRk9SRUlHTl8xIiwiYXV0aG9yaXRpZXMiOlsiYWxsIl0sImp0aSI6ImYzMTU0MGEyLTQwMjYtNDM1Ni1hODZhLWI4NjhmMmJlMmY3MiIsImNsaWVudF9pZCI6InRlc3QifQ.JcgK2cmdj3ZKkbeoJG1SI9XrIJK-0zZfLguQtNz07O4n3iGxTyVrJk6ElWZBhOfG2fGlCNn4priqJREyPADn3HQV2687WErknE9NIRjdro9tZIpc7iHS8LDcc-d-dz3bmgB5uSGlyKXPmdKHSiMt1NO4qds-J5-Hd5cWUBnDmp0rSb3fHCED9evjVzeVYFbuTLcPc5WRF3EKZ0tAxM9FsK5qlLQcCSd6YxNs2X02xBH5wvauntJaX8f-BVu11ogOEXGHQrAGdrvfa_azs2TjVVxro9V_IyiFafHw2Hza9CNLhx3O6KOGdOa_ocR8lBlv5eh49_3nWGu6zlzaJKWIJQ; 7cf012d25878614523054a695ab82538=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIwX0JOUFpzb2xhckBnbWFpbC5jb21fMiIsInNjb3BlIjpbImFsbCJdLCJhdGkiOiJmMzE1NDBhMi00MDI2LTQzNTYtYTg2YS1iODY4ZjJiZTJmNzIiLCJkZXRhaWwiOnsib3JnYW5pemF0aW9uSWQiOjAsInRvcEdyb3VwSWQiOm51bGwsImdyb3VwSWQiOm51bGwsInJvbGVJZCI6LTEsInVzZXJJZCI6MTM2NjkxNjUsInZlcnNpb24iOjEwMDAsImlkZW50aWZpZXIiOiJCTlBac29sYXJAZ21haWwuY29tIiwiaWRlbnRpdHlUeXBlIjoyLCJtZGMiOiJGT1JFSUdOXzEiLCJhcHBJZCI6bnVsbH0sIm1kYyI6IkZPUkVJR05fMSIsImF1dGhvcml0aWVzIjpbImFsbCJdLCJqdGkiOiI4OTNmNTNjNi00MDM3LTQwOGEtOWM3YS03NzI0OTQ2NmFhN2IiLCJjbGllbnRfaWQiOiJ0ZXN0In0.TKl0NpxiwDSmg3H4d44yUOibJso8rJNFIp7WIRkU9fz0pp9C2kjcEqRu1NfNfYI_hxeckxhXrVtrnoIQ_KeII-Uebxbm2uaDGvOyhGudu7ZzJDXN04GBZzHgNY-3kEfX4aIcy4zFdt_p1tFsvFltV_OAJuR00yju039Xr4DnppGtva-zZ8mNm8nf-94S1V4DhZNWCBSrj1XzYte3Fx-O5AvpueA598UBK-iR2aJxXvku1OG9cDrLhJ66Bq3B_5C30VdvAktvu7xRrWW7pH5YfawpDauF1JzI_3ZXaC3szRrC0wBfKvKPHS_e9tmHZ8lxnzwXc0dMZx9al4LG0g5IWA; 9c06955b4cc085746da8249e6263562b=email; acw_tc=e4c85db4bdda9aff6a24d7221e08eca73ff52b9ebd8cfcecd2cc969653b197da; Hm_lpvt_d31b40fac8544e512e39ba607467fd1e=1721956464",
                "Referer": "https://globalhome.solarmanpv.com/plant/infos/device",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
        });
        return await response.json();
    },
    getHistoryDataHybrid: async (deviceId, token, startTime, key) => {
        let response = await fetch(`https://globalhome.solarmanpv.com/device-s/device/${deviceId}/stats/day?showParams=${key}&lan=en&day=${startTime}&showParams[]=${key}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "authorization": `Bearer ${token}`,
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": "_ga=GA1.1.140525135.1717048719; _gcl_au=1.1.1295041529.1717048720; _ga_FHKTLVVX1C=GS1.1.1719479564.13.0.1719479577.0.0.0; language=en; tfstk=fHkSeEjfCabSIPnb-7K4CFI85qyIL49aJMZKjDBPv8eRRHgx832EL8kCdri3zJRuTvwIlDCU9U2rdqink3VU88pIOVgcUzLHq6pIJVgQt34UJygEvb-2QdooqJ2KRFJwQi_ddQu5JkepvoE3A6k0ionoqJjmT1v8-0fBZNsWAJ3LHSE_AJCRe2FYMkzAekB8vsKbxrULp7BdDsEzv_EdeyhPOEZDNznWcRIhufLyXNacp9HJZSa6o-Emqxt8ali-FRyih9F7W0UfpFP_oJ4QoAL2Gm0sw4rmRdTbBf0jd5eBFNqSMcwYzRd1G8iqrAw-CU6z0-4u6XFX2LnbFzNgcqIdN8GKrvNoNMxiD83msPVJiEqjUAPQSS_vymoby5GIzEXLzfixl5kVuOytsqMQ6RIyvOz_jbCCc5XQcP-Xc6fE1OD_2WVK1PP8mokwcn_5t7E0cP-Xc6f3woq4_ntfP6f..; Hm_lvt_d31b40fac8544e512e39ba607467fd1e=1721291481,1721497306,1721822236,1721945086; HMACCOUNT=F5D7B45250026F7C; 0cc559da264288e76f8abee174ab5686=false; 9ac11337b7141049af7c75b907e61cc5=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIwX0JOUFpzb2xhckBnbWFpbC5jb21fMiIsInNjb3BlIjpbImFsbCJdLCJkZXRhaWwiOnsib3JnYW5pemF0aW9uSWQiOjAsInRvcEdyb3VwSWQiOm51bGwsImdyb3VwSWQiOm51bGwsInJvbGVJZCI6LTEsInVzZXJJZCI6MTM2NjkxNjUsInZlcnNpb24iOjEwMDAsImlkZW50aWZpZXIiOiJCTlBac29sYXJAZ21haWwuY29tIiwiaWRlbnRpdHlUeXBlIjoyLCJtZGMiOiJGT1JFSUdOXzEiLCJhcHBJZCI6bnVsbH0sImV4cCI6MTcyNzEyOTA5MiwibWRjIjoiRk9SRUlHTl8xIiwiYXV0aG9yaXRpZXMiOlsiYWxsIl0sImp0aSI6ImYzMTU0MGEyLTQwMjYtNDM1Ni1hODZhLWI4NjhmMmJlMmY3MiIsImNsaWVudF9pZCI6InRlc3QifQ.JcgK2cmdj3ZKkbeoJG1SI9XrIJK-0zZfLguQtNz07O4n3iGxTyVrJk6ElWZBhOfG2fGlCNn4priqJREyPADn3HQV2687WErknE9NIRjdro9tZIpc7iHS8LDcc-d-dz3bmgB5uSGlyKXPmdKHSiMt1NO4qds-J5-Hd5cWUBnDmp0rSb3fHCED9evjVzeVYFbuTLcPc5WRF3EKZ0tAxM9FsK5qlLQcCSd6YxNs2X02xBH5wvauntJaX8f-BVu11ogOEXGHQrAGdrvfa_azs2TjVVxro9V_IyiFafHw2Hza9CNLhx3O6KOGdOa_ocR8lBlv5eh49_3nWGu6zlzaJKWIJQ; 7cf012d25878614523054a695ab82538=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIwX0JOUFpzb2xhckBnbWFpbC5jb21fMiIsInNjb3BlIjpbImFsbCJdLCJhdGkiOiJmMzE1NDBhMi00MDI2LTQzNTYtYTg2YS1iODY4ZjJiZTJmNzIiLCJkZXRhaWwiOnsib3JnYW5pemF0aW9uSWQiOjAsInRvcEdyb3VwSWQiOm51bGwsImdyb3VwSWQiOm51bGwsInJvbGVJZCI6LTEsInVzZXJJZCI6MTM2NjkxNjUsInZlcnNpb24iOjEwMDAsImlkZW50aWZpZXIiOiJCTlBac29sYXJAZ21haWwuY29tIiwiaWRlbnRpdHlUeXBlIjoyLCJtZGMiOiJGT1JFSUdOXzEiLCJhcHBJZCI6bnVsbH0sIm1kYyI6IkZPUkVJR05fMSIsImF1dGhvcml0aWVzIjpbImFsbCJdLCJqdGkiOiI4OTNmNTNjNi00MDM3LTQwOGEtOWM3YS03NzI0OTQ2NmFhN2IiLCJjbGllbnRfaWQiOiJ0ZXN0In0.TKl0NpxiwDSmg3H4d44yUOibJso8rJNFIp7WIRkU9fz0pp9C2kjcEqRu1NfNfYI_hxeckxhXrVtrnoIQ_KeII-Uebxbm2uaDGvOyhGudu7ZzJDXN04GBZzHgNY-3kEfX4aIcy4zFdt_p1tFsvFltV_OAJuR00yju039Xr4DnppGtva-zZ8mNm8nf-94S1V4DhZNWCBSrj1XzYte3Fx-O5AvpueA598UBK-iR2aJxXvku1OG9cDrLhJ66Bq3B_5C30VdvAktvu7xRrWW7pH5YfawpDauF1JzI_3ZXaC3szRrC0wBfKvKPHS_e9tmHZ8lxnzwXc0dMZx9al4LG0g5IWA; 9c06955b4cc085746da8249e6263562b=email; acw_tc=df8e264ac0376448620578c8ef33be6cf5e3fcb833ced4122a3d08c7d56fa58e; Hm_lpvt_d31b40fac8544e512e39ba607467fd1e=1721990004",
                "Referer": "https://globalhome.solarmanpv.com/plant/infos/device",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
        });
        return await response.json();
    }
}