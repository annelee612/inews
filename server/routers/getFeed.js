var express = require('express');

//local files
var API_KEY = require('../config.js').API_KEY;

var router = express.Router();

router.route('/').get(function(req, res) {
  res.json({feeds: ['Election', 'Liverpool', 'Tentacles', 'Robot Consciousness']});
});

module.exports = router;
