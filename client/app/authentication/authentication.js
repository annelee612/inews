'use strict';

angular
.module('inews.authentication', [])
.controller('AuthenticationController', function($scope, $window, AuthenticationService) {
  $scope.user = {};

  $scope.signup = function() {
    AuthenticationService.signup($scope.user).then(function(resp) {
      $window.localStorage.setItem('com.inews', resp.data.token);
      // determine how to show the logout button, hide the login button and show
      // the custom news sections
    });
  };

  $scope.login = function() {
    AuthenticationService.login($scope.user).then(function(resp) {
      $window.localStorage.setItem('com.inews', resp.data.token);
      // determine how to show the logout button, hide the login button and show
      // the custom news sections
    });
  };

  $scope.logout = function() {
    AuthenticationService.logout();
    // set the UI states after logout
  };

  $scope.isAuth = function() {

    return AuthenticationService.isAuth();
  };
});
