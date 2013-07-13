'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'HomeController' }),
    $routeProvider.when('/channels/:name', {templateUrl: 'partials/channels.html', controller: 'MissionController'}),
    $routeProvider.when('/hosts/:name', {templateUrl: 'partials/host.html', controller: 'HostController'}),
    $routeProvider.otherwise({redirectTo: '/'})
  }])
  .run(['$window', 'auth', function($window, auth){
  	if($window.localStorage.getItem("token") != null){
  		console.log("Had localstore");
  		auth.setToken($window.localStorage.getItem("token"))
  	}
  }])