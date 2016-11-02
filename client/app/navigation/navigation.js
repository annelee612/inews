'use strict';

angular.module('inews.navigation', [])

.controller('navController', function($scope, $mdDialog, AuthenticationService, $window, $location) {

  $scope.user = {};

  $scope.meetupshow = function() {
    $window.open('/auth');
  };

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
