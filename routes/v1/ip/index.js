const router = require('express').Router();

router.use('/me', require('./me.js'));
router.use('/lookup', require('./lookup.js'));

module.exports = router;