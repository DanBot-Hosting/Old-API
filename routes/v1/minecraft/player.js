const router = require('express').Router();
const axios = require('axios');

router.get('/:user', async function(req, res, next) {

    let user = req.params.user;
    if (!user) return res.status(404).json({ error: "missing user" });
    
    let response = await axios.get("https://api.ashcon.app/mojang/v2/user/" + user);
    let data = response.data;

    res.status(200).json(data)
});

module.exports = router;
