'use strict';

angular.module('inews', [
  'ngMaterial',
  'inews.services.authService',
  'inews.services.httpService',
  'inews.services.newsService'
])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('light-blue').backgroundPalette('blue');
  $mdThemingProvider.theme('light-orange').backgroundPalette('orange');
  $mdThemingProvider.theme('light-grey').backgroundPalette('grey');
  $mdThemingProvider.theme('light-green').backgroundPalette('green');
})

.controller('appCtrl', function($scope, $mdDialog, AuthenticationService, newsService, $window) {
  
  /////////////// NEWS FEEDS /////////////////////
  $scope.newsfeeds = [];
  newsService.getAllFeeds().then(function(results){
    console.log('after wash', results);
    $scope.newsfeeds = results;
  });

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
    return AuthenticationService.isAuth();
  };

});
