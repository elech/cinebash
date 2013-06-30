'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('HomeController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.channels;
    $scope.q;

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
      $http.get('http://192.168.15.187:3000/channels?name=' + $scope.q).success(function(data) {
        $scope.channels = data.channels;
        console.log($scope.channels);
      })
      .error(function(data){
        console.log(data + " failed");
      });
    }

    $scope.startChannel = function(){
      $scope.safeApply($location.path('/hosts/' + $scope.startChannelName));
    }
  }])

  .controller('MissionController',[ '$scope', '$http', 'youTubePlayer', 'nowPlayingList', 'youTubeHandler', function($scope, $http, ytp, np, yth){
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

  .controller('PlayerController', ['$scope', 'youTubePlayer', '$http', function($scope, ytp, $http){
    $scope.play = function(){
      $http.post('/player', {action: 'play'})
      .success(function(){

      })
      .error(function(){
        alert('erroed');
      })
/*      var state = ytp.player.getPlayerState();
      if(state == 2){
        ytp.player.playVideo();
      } else if(state == -1 || state == 0){
        ytp.ended();
      }*/
    }

    $scope.pause = function(){
      $http.post('/player', {action: "pause"})
      .success(function(data, status, headers){

      })
      .error(function(){
        alert('errored');
      })
    }
    $scope.next = function(){
      $http.post('/player', {action: "next"})
      .success(function(){

      })
      .error(function(){
        alert('errored');
      })

    }
  }])
  .controller('HostController', ['socket', function(socket){
    socket.connect();
  }])
  .controller('ChannelsController', [function(){
    
  }]);