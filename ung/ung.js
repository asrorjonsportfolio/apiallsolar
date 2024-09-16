module.exports = {
    login: async function () {
        let response = await fetch("https://pms.ung.uz/api/auth/login", {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                password: "Sa&4125df",
                username: "ortiqboev.Shahzod"
            }),
            "method": "POST"
        })
        return await response.json();
    },
    getDeviceList: async function () {
        let response = await fetch("https://pms.ung.uz/api/auth/login", {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                password: "Sa&4125df",
                username: "ortiqboev.Shahzod"
            }),
            "method": "POST"
        })
        response = await response.json();
        console.log(response.data.token)
        let result = await fetch("https://pms.ung.uz/api/solar-monitoring/inventor-report?organisation_id=34", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,sk;q=0.8,ru;q=0.7",
                "authorization": `Bearer ${response.data.token}`,
                "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Microsoft Edge\";v=\"128\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-lang": "uz",
                // "cookie": "_ym_uid=1726296446208193702; _ym_d=1726296446; _ga=GA1.1.994796039.1726296447; _ga_H037N9LZ00=GS1.1.1726306735.2.1.1726306749.46.0.0; _csrf=83a687a2612b5cb36abb0ad063c39d1c14f7ca0cd176f9cd278723520100c073a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22jM1VV21I0UzJ6MY40i6GCf_vmNFIHG3k%22%3B%7D",
                "Referer": "https://pms.ung.uz/dash-monitoring",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
        });
        return await result.json();
    }
}