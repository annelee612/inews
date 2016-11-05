'use strict';

angular.module('inews.services.newsService', [])
.factory('newsService', function($q, httpService) {

  var _validateNewsfeed = function(newsfeed) {
    if (!newsfeed || !newsfeed.title) {
      return false;
    }
    return true;
  };

  var getAllFeeds = function() {
    var deferred = $q.defer();
    var topics = [];
    
    var getGeoLocation = function(options) {
      return $q(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    $q.all([httpService.get('/api/newsfeeds'),
            getGeoLocation()]).then(function(results) {
      var promises = [];
      
      //Location
      if (results[1]) {
        var lat = results[1].coords.latitude;
        var lon = results[1].coords.longitude;

        promises.push(httpService.get('/api/weather?lat=' + lat + '&lon=' + lon));
        promises.push(httpService.get('/api/localnews?lat=' + lat + '&lon=' + lon));
      }

      if (results[0].data.feeds.length > 0) {
        var feeds = results[0].data.feeds;
        topics = results[0].data.feeds;
        for (var i = 0; i < feeds.length; i++) {
          promises.push(httpService.get('/api/newsfeeds/' + feeds[i]));
        }
      }

      return $q.all(promises);
    }).then(function(results) {
      var weatherAndNews = {
        weather: results[0].data,
        news: [],
        topics: topics
      }

      for (var i = 1; i < results.length; i++) {
        if (results[i].data.newsItems) {
          var newsItems = JSON.parse(results[i].data.newsItems[0]);
          results[i].data.newsItems = newsItems;
          weatherAndNews.news.push(results[i].data);  
        } else {
          console.log('no such feed');
        }
      }
    
      deferred.resolve(weatherAndNews);
    }).catch(function(error) {
      deferred.reject(error);      
    });

    return deferred.promise;
  };

  var getNewsForFeed = function(newsfeedId) {
    console.log('get all newsfeeds not implemented');
    return [];
  };

  var createFeed = function(newsfeed) {
    console.log('create feed is not implemented');
    if (!_validateNewsfeed(newsfeed)) {
      console.log('newsfeed did not validate');
    }
    return {};
  };

  var updateFeed = function(newsfeed) {
    console.log('update feed is not implemented');
    if (!_validateNewsfeed(newsfeed)) {
      console.log('newsfeed did not validate');
    }
    return {};
  };

  var destroyFeed = function(newsfeedId) {
    console.log('remove feed is not implemented');
    return {};
  };

  var test = function() {
    return $q(function (resolve, reject) {
      resolve('success');
    });
  };

  return {
    test: test,
    getAllFeeds: getAllFeeds,
    getNewsForFeed: getNewsForFeed,
    createFeed: createFeed,
    updateFeed: updateFeed,
    destroyFeed: destroyFeed
  };

});
