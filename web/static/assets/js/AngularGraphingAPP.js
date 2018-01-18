var MomVision = angular.module('MomVision', ['ngRoute','ngSanitize']).
config(function ($routeProvider, $sceDelegateProvider) {;
  $sceDelegateProvider.resourceUrlWhitelist([
  // Allow same origin resource loads.
  'self',
  'https://momvisionproject.herokuapp.com/',
  'http://*.herokuapp.com/**']);
});
