var express = require('express');
var Feed = require('../models/Feed.js');
const request = require('request-promise');

//local files
var WEATHER_API_KEY = require('../config.js').WEATHER_API_KEY;

var router = express.Router();

router.route('/meetups').get(function(req, res) {
  console.log(req.user);
  var options = {
    method: 'GET',
    url: 'https://api.meetup.com/recommended/events?&sign=true&photo-host=public&page=10',
    headers: {
          'User-Agent': 'iNews Project 0.0.2',
          'Authorization': 'Bearer '+req.user.password
      }
  };
  //get request to bing with our bing API key
  request(options).then(content => {
    content = JSON.parse(content);
    res.json({title:'Recommended Meetups', color:'#EE0509', meetups:content});
  });
});

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
  if (!req.query.lat || !req.query.lon) return res.json({message: 'You must include lat and lon as query parameters'});
  var options = {
    method: 'GET',
    url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + req.query.lat + '&lon=' + req.query.lon,
    headers: {
          'User-Agent': 'iNews Project 0.0.2'
      }
  };
  // transform geo data to address usable by weather underground using wu's autocomplete api.
  request(options).then(content => {
    content = JSON.parse(content);
    request({url:'http://autocomplete.wunderground.com/aq?query='+content.address.postcode+'&c=US'}).then(resp => {
      resp = JSON.parse(resp);
      request({url:'https://api.wunderground.com/api/'+WEATHER_API_KEY+'/conditions/'+resp.RESULTS[0].l+'.json', headers: {'User-Agent': 'iNews Project 0.0.2' }}).then(content => {
        var content = JSON.parse(content);
        if (!content || Object.keys(content).length===0) return res.json({message: 'Error getting weather data'});
        var weather = {title: 'Weather for '+content.current_observation.display_location.full, color: '#FFDF00', current: content};
        request({url:'https://api.wunderground.com/api/'+WEATHER_API_KEY+'/forecast/'+resp.RESULTS[0].l+'.json', headers: {'User-Agent': 'iNews Project 0.0.2' }}).then(forecast => {
          weather.forecast = JSON.parse(forecast);
          res.json(weather);
        });
      });
    });
  });
});

module.exports = router;
