var express = require('express');
var Feed = require('../models/Feed.js');

//local files
var API_KEY = require('../config.js').API_KEY;

var router = express.Router();

router.route('/').post(function(req, res) {
  let newFeed = new Feed();
  newFeed.title = req.body.title;
  newFeed.userId = req.user ? req.user.username : 't'; // default username for testing only
  newFeed.color = '#3366ff';
  newFeed.order = 1;
  newFeed.id = newFeed.title.toLowerCase().replace(/ /g, '-');
  newFeed.save().then(function(feed) {
    feed.refresh().then(fullFeed => res.json(fullFeed));
  });
});

router.route('/:id').get(function(req, res) {
  Feed.findOne({id: req.params.id}).then(function(feed) {
    if (!feed) return res.json({message: 'No such feed'});
    return res.json(feed);
  });
});

router.route('/').get(function(req, res) {
  if (req.user) {
    res.json({feeds: ['Pugs', 'Catholic Priests', 'React vs Angular', 'Hack Reactor']});
  } else {
    res.json({feeds: ['Election', 'Liverpool', 'Tentacles', 'Robot Consciousness']});
  }
});

module.exports = router;
