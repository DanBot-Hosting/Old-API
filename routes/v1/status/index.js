const router = require('express').Router();
const axios = require('axios');

router.get('/', async function(req, res, next) {
    res.status(200).json({
        status: "online"
    });
});

module.exports = router;
