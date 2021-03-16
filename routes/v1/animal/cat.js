const router = require('express').Router();

router.get('/', async function(req, res, next) {

    res.status(200).json({message: "not done yet!" });

});

module.exports = router;