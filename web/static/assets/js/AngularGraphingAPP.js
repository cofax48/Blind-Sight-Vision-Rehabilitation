var BlindSightVision = angular.module('BlindSightVision', ['ngRoute','ngSanitize']).
config(function ($routeProvider, $sceDelegateProvider) {;
  $sceDelegateProvider.resourceUrlWhitelist([
  // Allow same origin resource loads.
  'self',
  'http://*.herokuapp.com/**']);
});
