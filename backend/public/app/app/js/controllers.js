'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('HomeController', ['$scope','$location','Channel', function($scope,$location, ChannelResource) {
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
      $scope.safeApply($location.path('/channels/'+ $scope.channels[index].substring(1)));
    }

    $scope.searchForChannels = function(){
      ChannelResource.query({name: $scope.q},
      function(data, status, headers){
        console.log(data);
        $scope.channels = data.channels;
      },
      function(){
        console.log('derp');
      })
    }

  }])
  .controller("StartChannelController", ['$scope', 'auth', 'Channel', '$location', '$http', function($scope, auth, ChannelResource, $location, $http){
    $scope.available = false;
    $scope.startChannelName = "";
    $scope.$watch('startChannelName', function(){
      ChannelResource.query({name: $scope.startChannelName},
        function(data){
          if(data.channels.indexOf("/" + $scope.startChannelName) === -1 && $scope.startChannelName !== ""){
            $scope.available = true;
          } else{
            $scope.available = false;
          }  
        }, function(){
          //something
        })
    })

    $scope.startHostingChannel = function(){
      $scope.safeApply($location.path('/hosts/' + $scope.startChannelName));
    }


    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest')
        this.$eval(fn);
      else
        this.$apply(fn);
    };
    
  }])
  .controller('MissionController',[ '$scope', '$http', 'nowPlayingList', 'Song', '$route', 'youTubePlayer', function($scope, $http, np, SongResource, $route, ytp){
    $scope.playlist = true;
    $scope.q;
    //$scope.songs = np.getSongs();
    ytp.loadScripts();

    $scope.refresh = function(){
      SongResource.query({name: $route.current.params.name},
        function(data){
          np.setSongs(data);
        },
        function(){
          console.log('error');
        })
    }

    $scope.$watch(function(){ return np.getSongs()}, function(newSongs, OldSongs){
      $scope.songs = newSongs;
    })
  }])
  .controller('PlayerController', ['$scope', '$http', '$route', 'nowPlayingList', '$timeout', function($scope, $http, $route, np, $timeout){
    $scope.channelName = $route.current.params.name;
    $scope.play = function(){
      $http.post('/channels/' + $scope.channelName + '/actions', {action: 'play', channel: $scope.channelName})
      .success(function(){

      })
      .error(function(){
        alert('erroed');
      })
    }

    $scope.pause = function(){
      $http.post('/channels/' + $scope.channelName + '/actions', {action: "pause", channel: $scope.channelName})
      .success(function(data, status, headers){

      })
      .error(function(){
        alert('errored');
      })
    }
    $scope.next = function(){
      $http.post('/channels/' + $scope.channelName + '/actions', {action: "next", channel: $scope.channelName})
      .success(function(){

      })
      .error(function(){
        alert('errored');
      })
    }

    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest')
        this.$eval(fn);
      else
        this.$apply(fn);
    };

  }])
  .controller('HostController', ['$scope', 'socket', '$rootScope', function($scope, socket, $rootScope){

    $scope.connect = function(){
        socket.connect();
    }

    $scope.socketOnline = function(){
      return socket.getStatus();
    }

    $scope.disconnect = function(){
      $scope.safeApply(function(){
        socket.disconnect();
      });
      console.log('disconnected');
    }

    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest')
        this.$eval(fn);
      else
        this.$apply(fn);
    };

  }])