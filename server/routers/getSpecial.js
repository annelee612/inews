var express = require('express');
var Feed = require('../models/Feed.js');
const request = require('request-promise');

//local files
var API_KEY = require('../config.js').API_KEY;

var router = express.Router();

router.route('/localnews').get(function(req, res) {
  var options = {
    method: 'GET',
    url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + req.query.lat + '&lon=' + req.query.lon,
    headers: {
          'User-Agent': 'iNews Project 0.0.2'
      }
  };
  //get request to bing with our bing API key
  request(options).then(content => {
    content = JSON.parse(content);
    console.log(content, content.place_id, content.address);

    let feedtitle = content.address.city + ' ' + content.address.neighbourhood;
    let feedid = feedtitle.toLowerCase().replace(/ /g, '-');
    Feed.findOne({id:feedid}).then(function(feed) {
      if (!feed) {
        let newFeed = new Feed();
        newFeed.title = feedtitle;
        newFeed.userId = 'everyone';
        newFeed.color = '#9966ee';
        newFeed.order = 1;
        newFeed.id = feedid;
        newFeed.save().then(function(feed) {
          feed.refresh().then(fullFeed => res.json(fullFeed));
        });
      } else {
        res.json(feed);
      }
    });
  });
});

router.route('/weather').get(function(req, res) {

});

module.exports = router;
