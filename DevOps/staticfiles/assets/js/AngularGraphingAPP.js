var MomVision = angular.module('MomVision', ['ngRoute','ngSanitize']).
config(function ($routeProvider, $sceDelegateProvider) {;
  $sceDelegateProvider.resourceUrlWhitelist([
  // Allow same origin resource loads.
  'self',
  'http://*.herokuapp.com/**']);
});
