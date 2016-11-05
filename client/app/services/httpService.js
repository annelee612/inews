'use strict';

angular.module('inews.services.httpService', [])
.factory('httpService', function httpService($http) {

  //CREATE
  function create(relativUrl, data) {
    return $http({
      accept: "application/json",
      method: "POST",
      withCredentials: true,
      url: relativUrl,
      data: data
    }, {withCredentials: true});
  }

  //READ
  function get(relativUrl, cache) {
    return $http({
      cache: cache,
      accept: "application/json",
      method: "GET",
      url: relativUrl
    });
  }

  //UPDATE
  function update(relativUrl, data) {
    return $http({
      accept: "application/json",
      method: "PUT",
      url: relativUrl,
      data: data
    });
  }

  //DELETE
  function destroy(relativUrl) {
    return $http({
      accept: "application/json",
      method: "DELETE",
      url: relativUrl
    });
  }

  return {
    create : create,
    get : get,
    update: update,
    destroy : destroy
  };
});
