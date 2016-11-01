'use strict';

angular.module('inews.services.httpService', [])
.factory('httpService', function httpService($http) {
  
  //CREATE
  function create(relativUrl, data) {
    return $http({
      accept: "application/json",
      method: "POST",
      url: relativUrl,
      data: data
    });
  }

  //READ
  function getAll(relativUrl, cache, page, count) {
    return $http({
      cache: cache,
      accept: "application/json",
      method: "GET",
      url: relativUrl
    });
  }

  function get(relativUrl) {
    return $http({
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
  function deleteElement(relativUrl) {
    return $http({
      accept: "application/json",
      method: "DELETE",
      url: relativUrl
    });
  }

  return {
    create : create,
    get : get,
    getAll : getAll,
    update: update,
    deleteElement : deleteElement
  };
});
