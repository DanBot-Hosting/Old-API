const router = require('express').Router();

router.get('/', async function(req, res, next) {

    await res.status(200).json(await global.Status.getNodes());

});

module.exports = router;