const router = require('express').Router();

router.use('/nodes', require('./nodes'));
router.use('/locations', require('./locations'));
router.use('/stats', require('./stats'));

module.exports = router;