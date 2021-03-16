const router = require('express').Router();

router.use('/cat', require('./cat.js'));
router.use('/dog', require('./dog.js'));

module.exports = router;