const router = require('express').Router();

router.use('/server', require('./server'));
router.use('/player', require('./player'));

module.exports = router;
