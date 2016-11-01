'use strict';

angular.module('inews.services.authService', [])
.factory('AuthenticationService', function($http, $window) {

  var login = function(user) {
      return $http({
        method: 'POST',
        url: '/login',
        data: user
      })
      .then(function(resp) {
        if (resp.data && resp.data.user) {
          $window.localStorage.setItem('com.inews.user',JSON.stringify(resp.data.user));
        }
        return resp;
      });
  };

  var signup = function(user) {
    return $http({
      method: 'POST',
      url: '/signup',
      data: user
    })
    .then(function(resp) {
      return resp;
    })
    .catch(function(err) {
      throw(err);
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.inews.user');
  };

  var logout = function () {
    return $http({
      method: 'GET',
      url: '/logout'
    }).then(function(resp) {
      $window.localStorage.removeItem('com.inews.user');
      return resp;
    });
  };

  return {
    login: login,
    signup: signup,
    logout: logout,
    isAuth: isAuth
  };
});