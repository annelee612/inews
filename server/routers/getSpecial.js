var express = require('express');
var Feed = require('../models/Feed.js');
const request = require('request-promise');

//local files
var WEATHER_API_KEY = require('../config.js').WEATHER_API_KEY;

var router = express.Router();

router.route('/localnews').get(function(req, res) {
  if (!req.query.lat || !req.query.lon) return res.json({message: 'You must include lat and lon as query parameters'});
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
  var options = {
    method: 'GET',
    url: 'https://api.wunderground.com/api/'+WEATHER_API_KEY+'/conditions/q/CA/San_Francisco.json',
    headers: {
          'User-Agent': 'iNews Project 0.0.2'
      }
  };
  request(options).then(content => {
    console.log(content);
    res.json({id:'123', weatherdata: {current: 'sunny'}, healthWarning: 'I dont know how the API data will really look like yet'});
  });
});

module.exports = router;
