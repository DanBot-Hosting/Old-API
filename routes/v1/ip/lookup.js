const router = require('express').Router();
const axios = require('axios');
const cache = require('memory-cache');

router.get('/:ip', async function(req, res, next) {

    let ip = req.params.ip;
    if (!ip) return res.status(404).json({ error: "missing ip" });

    let iplookupCached = cache.get(`iplookup.${ip}`);
    if (iplookupCached) {
        res.status(200).json(iplookupCached);
    } else {
        let response = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`);
        let data = response.data;
        if (!data) return res.status(500).json({ error: "an error has occured" });
        cache.put(`iplookup.${ip}`, data);
        res.status(200).json(data);
        setTimeout(() => {
            cache.del(`iplookup.${ip}`);
        }, 5 * 60000);
    }

});

module.exports = router;