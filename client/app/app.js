'use strict';

angular.module('inews', [
  'ngMaterial',
  'inews.services',
  'inews.services.httpService',
  'inews.services.authService',
  'inews.defaultNews',
  'inews.localNews',
  'inews.customNews',
  'inews.navigation'
])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('light-blue').backgroundPalette('blue');
  $mdThemingProvider.theme('light-orange').backgroundPalette('orange');
  $mdThemingProvider.theme('light-grey').backgroundPalette('grey');
  $mdThemingProvider.theme('light-green').backgroundPalette('green');
});
