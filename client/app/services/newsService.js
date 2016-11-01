'use strict';

angular.module('inews.services.newsService', [])
.factory('newsService', function($q, httpService) {

  var _validateNewsfeed = function(newsfeed) {
    return true;
  };

  var getAllFeeds = function() {
    return $q.all([httpService.get('/api/newsfeeds'),
                   httpService.get('/api/weather?lat=37.7806521&lon=-122.40707229999998'),
                   httpService.get('/api/localnews?lat=37.7806521&lon=-122.40707229999998')])
    .then(function(results) {
      console.log(results);
      return results;
    }).catch(function(error) {
      console.log('catched an error');
      console.log(error);
      return [];
    });
  };

  var getNewsForFeed = function(newsfeedId) {
    console.log('get all newsfeeds');
    return [];
  };

  var createFeed = function(newsfeed) {
    if (!_validateNewsfeed(newsfeed)) {
      console.log('newsfeed did not validate');
    }
    return {};
  };

  var updateFeed = function(newsfeed) {
    if (!_validateNewsfeed(newsfeed)) {
      console.log('newsfeed did not validate');
    }
    return {};
  };

  var destroyFeed = function(newsfeedId) {
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
