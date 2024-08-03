fetch('https://hopewindcloud.eu/api/auth/sysAuth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        "userId":"1785153445366153218",
        "loginWay": 1,
        "loginType": "pc",
        "captchaBO": {},
        "password": "22081997Bnpz",
        "userName": "BNPZsolar",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlSWQiOiIxMDAwMDAwMDQiLCJ0ZW5hbnRJZCI6IjAwMDAwMSIsInJvbGVLRVkiOiJST0xFX0FQUExJQ0FUSU9OX0RJU1RSSUJVVE9SIiwidXNlck5hbWUiOiJCTlBac29sYXIiLCJleHAiOjE3MTgwOTU5NTYsInVzZXJJZCI6IjE3ODUxNTM0NDUzNjYxNTMyMTgifQ.-FwuX_Rl0FPn_WwrR2MIBFs95Aeyulgr95z4EiTqOw4"
    })
}).then(r => r.json())
    .then(data => console.log(data.result.token))
    .catch(error => console.error('Error:', error));
