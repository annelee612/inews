var express = require('express');
var Feed = require('../models/Feed.js');

//local files
var API_KEY = require('../config.js').API_KEY;

var router = express.Router();

router.route('/').post(function(req, res) {
  // enable the following line to restrict this route to logged-in users only
  // if (!req.user) return res.json({message: 'You need to be logged in to create a feed'});
  let newFeed = new Feed();
  newFeed.title = req.body.title;
  newFeed.userId = req.user ? req.user.username : 't'; // default username for testing only
  newFeed.color = req.body.color || '#3366ff';
  newFeed.order = 1;
  newFeed.id = newFeed.title.toLowerCase().replace(/ /g, '-');
  newFeed.save().then(function(feed) {
    feed.refresh().then(fullFeed => res.json(fullFeed));
  });
});

router.route('/:id').delete(function(req, res) {
  Feed.remove({id: req.params.id}).then((result) => {
    if (result.result.n === 0 || result.result.ok != 1) res.json({message:'No such feed'}); else res.json({message:'Feed deleted'});
  });
});
router.route('/:id').put(function(req, res) {
  Feed.findOne({id: req.params.id}).then((result) => {
    if (!result) return res.json({message:'No such feed'}); // TODO: add authentication here in production.
    result.title = req.body.title || result.title;
    result.order = req.body.order || result.order;
    result.color = req.body.color || result.color;
    result.id = req.body.title.toLowerCase().replace(/ /g, '-') || result.title;
    result.save().then(function(feed) {
      feed.refresh().then(modifiedFeed => res.json(modifiedFeed));
    });
  });
});

router.route('/:id').get(function(req, res) {
  // enable the following line to restrict this route to logged-in users only
  // if (!req.user) return res.json({message: 'You need to be logged in to view feeds'});
  Feed.findOne({id: req.params.id}).then(function(feed) {
    // also uncomment the following to limit users to their own feeds.
    if (!feed /*|| (feed.userId != req.user.username && feed.userId != 'everyone')*/) return res.json({message: 'No such feed'});
    if (Date.now() - feed.lastRefresh > 10000000) { // if our cached one is > 2.5hrs old, refresh it from bing news
      console.log('Refreshing feed');
      feed.refresh().then(refreshedFeed => res.json(refreshedFeed));
    } else {
      console.log('Enjoy this stale news');
      return res.json(feed);
    }
  });
});

router.route('/').get(function(req, res) {
  if (req.user) {
    Feed.find({userId: req.user.username}).then(feeds => {
      res.json(feeds.map(feed => feed.title));
    });
  } else {
    res.json({feeds: ['election', 'liverpool', 'tentacles', 'robot_consciousness']});
  }
});

module.exports = router;
