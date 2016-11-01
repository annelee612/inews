'use strict';

angular.module('inews.services.newsService', [])
.factory('newsService', function(httpService) {

  var _validateNewsfeed = function(newsfeed) {
    return true;
  };

  var getAllFeeds = function() {
    var feedsPromise = httpService.get('/api/newsfeeds');
    var weatherPromise = httpService.get('/api/weather');
    return [];
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

})
