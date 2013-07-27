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
      $scope.safeApply($location.path('/channels/'+ $scope.channels[index]));
    }

    $scope.keydown = function($event){
      if($event.keyCode === 13){
        $scope.searchForChannels();
      }
    }

    $scope.searchForChannels = function(){
      ChannelResource.query({name: $scope.q},
      function(data, status, headers){
        console.log(data);
        $scope.channels = data.channels;
      },
      function(){
        //
      })
    }

  }])
  .controller("StartChannelController", ['$scope', 'auth', 'Channel', '$location', '$http', function($scope, auth, ChannelResource, $location, $http){
    $scope.available = false;

    $scope.keydown = function($event){
      if($event.keyCode === 13
        && $scope.available
        && $scope.startChannelName){
        $scope.startHostingChannel();
      }
    }

    $scope.$watch('startChannelName', function(){
        ChannelResource.query({name: $scope.startChannelName},
          function(data){
            if(data.channels.indexOf($scope.startChannelName) === -1 && $scope.startChannelName !== ""){
              $scope.available = true;
            } else{
              $scope.available = false;
            }
          }, function(){
            //failed
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
  .controller('MissionController',[ '$scope', 'nowPlayingList', 'Song', '$route', 'youTubePlayer', 'youTubeSong', '$location', '$timeout', function($scope, np, SongResource, $route, ytp, yts, $location, $timeout){
    $scope.playlist = true;
    $scope.q;
    $scope.searchSongs = null;
    $scope.songs = np.getSongs();
    $scope.tabs = [{},{}];

    $scope.refresh = function(timeout){
      timeout = timeout || 0;
      $timeout(function(){
        SongResource.query({name: $route.current.params.name},
          function(data){
            $scope.songs = data;
          },
          function(){
            console.log('error');
          })
      }, timeout);
    }

    $scope.search = function(){
      yts.search($scope.q).success(function(data, status, headers){
        $scope.searchSongs = yts.parseSearch(data);
        $scope.tabs[1].active = true;
      });
    }

    if($location.path().indexOf('channels') != -1){
      $scope.refresh();
    }


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
  .controller('HostController', ['$scope', 'socket', '$rootScope', 'youTubePlayer', function($scope, socket, $rootScope, ytp){
    ytp.loadScripts();
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

    $scope.connect();

  }])