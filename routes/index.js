var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    next({ statusCode: 200, message: "welcome!" });
});

module.exports = router;