const solarman = require("./solarman/solarman");

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

const solarmanCollect = (token) => {
    fetch("http://localhost:8080/solarman/collectData", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            access_token: token
        })
    })
        .then(async response => await response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
};

const solarmanLogin = async () => {
    let token = "";
    try {
        const login = await solarman.login('BNPZsolar@gmail.com', '22081997bnpz', '3407ff1952f47fa93548d7a65f957a93');
        token = login.access_token;
        solarmanCollect(token);
    } catch (error) {
        console.error("solarmanLogin", error);
    }
};

const runSolarman = async () => {
    console.log("redataSolarman");
    await solarmanLogin();
    await sleep(180000);
    await runSolarman();
};

try {
    runSolarman();
} catch (error) {
    console.error("run", error);
}