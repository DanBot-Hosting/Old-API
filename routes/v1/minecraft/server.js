const router = require('express').Router();
const util = require('minecraft-server-util');

router.get('/:host?/:port?', function(req, res, next) {

    let host = req.params.host;
    if (!host) return res.status(404).json({ error: "missing host" });

    let port = req.params.port;
    if (!port) port = 25565;

    util.status(host, { port: Number(port), timeout: 5000 })
        .then((response) => {
            let data = response;
            let object = {
                host: data.host,
                port: data.port,
                players: {
                    online: data.onlinePlayers,
                    max: data.maxPlayers,
                    sample: data.samplePlayers
                },
                version: data.version,
                protocol: data.protocolVersion,
                motd: data.description,
            }
            res.status(200).json(object)
        })
        .catch(function(e) {
        	console.error(e);
            return res.status(500).send({ error: "an error has occured" });
        })
});

module.exports = router;
