'use strict';

angular
.module('inews.services', [])
.factory('News', function($http) {

  // var getCurrentLocation = function(lat, long) {
  //   var url = 'http://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + long ;
  //   return $http({
  //     method: 'GET',
  //     url: url
  //   })
  //   .then(function (resp) {
  //     if (resp) {
  //       var address = resp.body.address;
  //       return {
  //         neigbourhood: address.neighbourhood,
  //         city: address.city,
  //         state: address.state,
  //         country: address.country_code
  //       }
  //     }
  //   });
  // };

  var getBingNews = function(query) {
    return $http({
      method: 'GET',
      url: '/api/getNews?search=' + query,
      headers: {'Ocp-Apim-Subscription-Key': 'e3bbf6615de14f4e8e2610f061c16ac5'}
    })
    .then(function(data) {
      return data;
    });
  };

  var getNeighborhood = function(lat, long) {
    return $http({
      method: 'GET',
      url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + long
    })
    .then(function(data) {
      return data.data.address;
    });
  };

  var getDefaultNews = function(src) {
    return $http({
      method: 'GET',
      url: 'https://newsapi.org/v1/articles?source=' + src + '&apiKey=25e1cb57f180459c8a21c273e7f6a795'
    })
    .then(function(data) {
      return data;
    });
  };

  return {
    getDefaultNews: getDefaultNews,
    getNeighborhood: getNeighborhood,
    getBingNews: getBingNews
  };

})
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
})
.factory('CustomNewsService', function($http, $window) {

  var edit = function(user) {
    return $http({
      method: 'PUT',
      url: '/api/user/edit',
      data: user
    })
    .then(function(resp) {
      return resp;
    })
    .catch(function(err) {
      throw(err);
    });
  };

  return {
    edit: edit
  };
});
