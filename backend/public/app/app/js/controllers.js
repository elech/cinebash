'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('HomeController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.channels;
    $scope.q;

    $http.jsonp("http://localhost:3000/channels?callback=JSON_CALLBACK")
    .success(function(data, status, headers){
      cconsole.log(data);
    })
    .error(function(data){
      console.log(data + "error");
    })
    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest')
        this.$eval(fn);
      else
        this.$apply(fn);
      };

    $scope.joinChannel = function(index){
      $scope.safeApply($location.path('/channels/'+ $scope.channels[index].name));
    }

    $scope.searchChannels = function(){
      $http.jsonp('http://localhost:3000/channels?name=' + $scope.q + "&callback=JSON_CALLBACK").success(function(data) {
        //console.log(data.channels + " asgag");
        //$scope.channels = data.channels;
      })
      .error(function(data){
        console.log(data + " failed");
      });
    }

    $scope.startChannel = function(){
      $scope.safeApply($location.path('/hosts/' + $scope.startChannelName));
    }
  }])

  .controller('MissionController',[ '$scope', '$http', 'youTubePlayer', 'nowPlayingList', function($scope, $http, ytp, np){
    $scope.yth = yth;
    $scope.ytp = ytp;
    $scope.playlist = true;
    $scope.q;
    $scope.songs = np.getSongs();
    $scope.startItUp = ytp.loadScripts;

    $scope.addSearchedSong = function(index){
      $scope.songs.push($scope.search[index]);
      $scope.search = null;
      $scope.playlist = true;
    }
  }])

  .controller('PlayerController', ['$scope', 'youTubePlayer', function($scope, ytp){
    $scope.play = function(){
      var state = ytp.player.getPlayerState();
      if(state == 2){
        ytp.player.playVideo();
      } else if(state == -1 || state == 0){
        ytp.ended();
      }
    }

    $scope.pause = ytp.pause;
    
    $scope.next = ytp.next;
  }])
  .controller('HostController', [function(){

  }])
  .controller('ChannelsController', [function(){
    
  }]);