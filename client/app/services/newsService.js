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

    var getGeoLocation = function(options) {
      return $q(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    getGeoLocation().then(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      
      return $q.all([httpService.get('/api/newsfeeds'),
                     httpService.get('/api/weather?lat=' + lat + '&lon=' + lon),
                     httpService.get('/api/localnews?lat=' + lat + '&lon=' + lon)]);
    }).then(function(results) {
      //TODO: clean the results array
      console.log('brefore wash', results);
      var newsfeeds = [];
      
      for (var i = 0; i < results.length; i++) {
        newsfeeds.push(results[i].data);
      }
      deferred.resolve(newsfeeds);
    }).catch(function(error) {
      console.error(error);
      deferred.reject();
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

  return {
    getAllFeeds: getAllFeeds,
    getNewsForFeed: getNewsForFeed,
    createFeed: createFeed,
    updateFeed: updateFeed,
    destroyFeed: destroyFeed
  };

});
