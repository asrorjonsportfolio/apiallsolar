const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routerS = require('./router/solarman');
const routerH = require('./router/hopecloud');
const routerF = require("./router/foxess");
const routerU = require("./router/ung");
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
// app.use(cors({
//     origin: '*', // Allow all origins
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
//     allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
// }));
// server.js
app.use(cors());
app.use("/solarman", bodyParser.json(), routerS);
app.use("/hopecloud", bodyParser.json(), routerH);
app.use("/foxess", bodyParser.json(), routerF);
app.use("/ung", bodyParser.json(), routerU);
app.listen(port, () => {
    console.log(`express server is working successfully ${port}`)
})
