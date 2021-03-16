const express = require("express");
const app = express();
const Cache = require('memory-cache');

const Config = require('./modules/config.js');
global.Config = new Config();

const Pterodactyl = require('./modules/pterodactyl.js');
global.Pterodactyl = new Pterodactyl(60000);

global.rateLimits = new Map();

let package = require('./package.json');
Cache.put('version', package['version']);

const PORT = global.Config.get("web.port");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
})

app.use((req, res, next) => {
    let realip = req.headers['x-forwarded-for'] || req.connection.remoteAddress.split(`:`).pop();
    console.log(`[${req.method}] request on ${req.originalUrl} from ${realip}`);
    next();
});
app.use("/", require("./routes"));

app.all("*", (req, res) => {
    res.status(404).json({ error: "invalid route" });
});

app.listen(PORT, () => {
    console.log(`Server running on: ${global.Config.get("web.host")}:${global.Config.get("web.port")}`);
});

module.exports = app;
