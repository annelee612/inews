'use strict';

angular.module('inews', [
  'ngMaterial',
  'inews.services.authService',
  'inews.services.httpService',
  'inews.services.newsService'
])
.config(function($mdThemingProvider, $locationProvider, $httpProvider) {
  $mdThemingProvider.theme('light-blue').backgroundPalette('blue');
  $mdThemingProvider.theme('light-orange').backgroundPalette('orange');
  $mdThemingProvider.theme('light-grey').backgroundPalette('grey');
  $mdThemingProvider.theme('light-green').backgroundPalette('green');

  $locationProvider.html5Mode(true);
  $httpProvider.defaults.withCredentials = true;
})

.controller('appCtrl', function($scope, $mdDialog, $location, $window,
                                AuthenticationService, newsService, httpService) {

  /////////////// NEWS FEEDS /////////////////////
  $scope.topics = [];
  $scope.newsfeeds = [];
  $scope.weather = {};
  $scope.meetupObject = {};
  newsService.getAllFeeds().then(function(results){
    console.log('results from getAllFeeds', results);
    $scope.topics = results.topics;
    $scope.newsfeeds = results.news;
    $scope.weather = results.weather;
    $scope.meetupObject = results.meetupObject;
  }).catch(function(error) {
    console.error(error);
  });

  $scope.meetupshow = function() {
    $window.open('/auth');
  };

  $scope.addNewsTopic = function() {
    var newId = $scope.newTopicInput.toLowerCase().replace(' ', '_');
    var newTopic = {
      title: $scope.newTopicInput,
      id: newId
    }

    $scope.topics.push(newTopic);
    $scope.newTopicInput = '';

    httpService.create('/api/newsfeeds', {
      title: newTopic.title
    }).success(function(data) {
      data.newsItems = JSON.parse(data.newsItems);
      $scope.newsfeeds.push(data);
    });
  };

  $scope.removeTopic = function(index) {
    var topic = $scope.topics[index];
    $scope.topics.splice(index, 1);
    for (var i = 0; i < $scope.newsfeeds.length; i++) {
      if ($scope.newsfeeds[i].title === topic.title) {
        $scope.newsfeeds.splice(i, 1);
        break;
      }
    }
  };

  //////////// AUTHENTICATION ////////////////////
  $scope.user = {};
  $scope.signinshow = function() {
    $scope.error = '';
    $mdDialog.show({
      contentElement: '#signInDialog',
      parent: angular.element(document.body)
    });
  };

  $scope.signinCancel = function() {
    $mdDialog.hide({
      contentElement: '#signInDialog',
      parent: angular.element(document.body)
    });
  };

  $scope.signupshow = function() {
    $scope.error = '';
    $mdDialog.show({
      contentElement: '#signUpDialog',
      parent: angular.element(document.body)
    });
  };

  $scope.signupCancel = function() {
    $mdDialog.hide({
      contentElement: '#signUpDialog',
      parent: angular.element(document.body)
    });
  };

  $scope.signup = function() {
    AuthenticationService.signup($scope.user).then(function(resp) {
      if (resp.data !== 'Cannot create new user') {
        $window.localStorage.setItem('com.inews', resp.data);
        $mdDialog.hide({
          contentElement: '#signUpDialog',
          parent: angular.element(document.body)
        });
      } else {
        $mdDialog.hide({
          contentElement: '#signUpDialog',
          parent: angular.element(document.body)
        });
        $scope.error = resp.data;
      }
    });
  };

  $scope.login = function() {
    AuthenticationService.login($scope.user).then(function(resp) {
      if (resp.data !== 'User does not exist') {
        $window.localStorage.setItem('com.inews', resp.data);
        $mdDialog.hide({
          contentElement: '#signInDialog',
          parent: angular.element(document.body)
        });
        $scope.$broadcast('signedin', $scope.user.username);
      } else {
        $mdDialog.hide({
          contentElement: '#signInDialog',
          parent: angular.element(document.body)
        });
        $scope.error = resp.data;
      }
    });
  };

  $scope.logout = function() {
    AuthenticationService.logout();
    $scope.$broadcast('signedout');
  };

  $scope.isAuth = function() {
    //console.log($location, $location.search());
    if ($location.absUrl().indexOf('user') !== -1) {
      //let queryString = '{"user"'+$location.absUrl().substr($location.absUrl().indexOf('user')+4, $location.absUrl().length).replace(/=/g,':').replace(/%22/g,'"').replace(/%7B/g,'{').replace(/%7D/g,'}') + '}';
      //let user = JSON.parse(queryString);
      let user = $location.search().user;
      $window.localStorage.setItem('com.inews.user',JSON.stringify(user));
      $location.search('');
    }
    return AuthenticationService.isAuth();
  };

});
