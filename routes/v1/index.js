const router = require('express').Router();

router.use('/', require('./status'));
router.use('/ip', require('./ip'));
router.use('/minecraft', require('./minecraft'));

module.exports = router;
