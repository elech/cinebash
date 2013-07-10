'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('HomeController', ['$scope', '$http', '$location', 'auth', 'Channel', 'User', function($scope, $http, $location, auth, ChannelResource, UserResource) {
    $scope.channels;
    $scope.q;
    $scope.dub;
    $scope.auth = auth;
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
      ChannelResource.query({name: $scope.q}, function(data, status, headers){
        $scope.channels = data.channels;
      })
    }


  }])
  .controller("StartChannelController", ['$scope', 'auth', 'Channel', '$location', '$http', function($scope, auth, ChannelResource, $location, $http){
   //auth.getToken() != null ? $scope.available = true : $scope.available = false;
    $scope.startChannelName = "";
    //TODO turn this shit off when it first loads
/*    $scope.$watch('startChannelName', function(){
      $scope.searchChannel();
    })*/

    $scope.searchChannel = function(){
      ChannelResource.get({channelId: $scope.startChannelName},
        function(data, status, headers){
          $scope.available = false;
        },
        function(data){
        if(data.status == 404){
          //Channel by the search name not found
          $scope.available = true;
          auth.setChannelName($scope.startChannelName);
        }
      });
    }
    
    $scope.startHostingChannel = function(){
      console.log(auth.getToken());
      if(auth.getToken()){
        $http({method: "GET", url: "http://localhost:3000/channel", headers: {"Authorization": "Bearer " + auth.getToken()}})
        .success(function(data, status, headers){
          $scope.safeApply($location.path('/hosts/' + data.name));  
        })
      } else{
       console.log('elsed');
       $scope.safeApply($location.path('/hosts/' + $scope.startChannelName));
      }
    }


    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest')
        this.$eval(fn);
      else
        this.$apply(fn);
    };
    
  }])
  .controller('MissionController',[ '$scope', '$http', 'youTubePlayer', 'nowPlayingList', 'youTubeHandler', function($scope, $http, ytp, np, yth){
    $scope.yth = yth;
    $scope.ytp = ytp;
    $scope.playlist = true;
    $scope.q;
    $scope.songs = np.getSongs();
    ytp.loadScripts();

    $scope.addSearchedSong = function(index){
      $scope.songs.push($scope.search[index]);
      $scope.search = null;
      $scope.playlist = true;
    }
  }])

  .controller('PlayerController', ['$scope', '$http', '$route', 'nowPlayingList', '$timeout', function($scope, $http, $route, np, $timeout){
    $scope.channelName = $route.current.params.name;
    $scope.play = function(){
      $http.post('http://localhost:3000/channels/' + $scope.channelName + '/player', {action: 'play', channel: $scope.channelName})
      .success(function(){

      })
      .error(function(){
        alert('erroed');
      })
    }

    $scope.pause = function(){
      $http.post('/channels/' + $scope.channelName + '/player', {action: "pause", channel: $scope.channelName})
      .success(function(data, status, headers){

      })
      .error(function(){
        alert('errored');
      })
    }
    $scope.next = function(){
      $http.post('/channels/' + $scope.channelName + '/player', {action: "next", channel: $scope.channelName})
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
  .controller('ChannelsController', [function(){
    
  }])
  .controller('LoginController', ['auth', '$location', function(auth, $location){

  }])