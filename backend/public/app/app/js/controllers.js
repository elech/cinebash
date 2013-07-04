'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('HomeController', ['$scope', '$http', '$location', 'auth', '$window', function($scope, $http, $location, auth, $window) {
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
      $http.get('http://localhost:3000/channels?name=' + $scope.q).success(function(data) {
        $scope.channels = data.channels;
        console.log($scope.channels);
      })
      .error(function(data){
        console.log(data + " failed");
      });
    }

    $scope.startChannel = function(){
      //auth.setChannelName($scope.startChannelName);
      //$scope.safeApply($location.path('/hosts/' + $scope.startChannelName));
      var dub = $window.open("https://accounts.google.com/o/oauth2/auth?response_type=token&client_id=730381482631.apps.googleusercontent.com&redirect_uri=http://localhost:3000/app/app/index-e2e.html&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email");
      console.log(dub.location);
    }

/*start of dat shit*/
/*$scope.$on("$routeChangeStart",function(next,current){
  var params = {}, queryString = $location.path().substring(1), regex = /([^&=]+)=([^&]*)/g, m;
  while (m = regex.exec(queryString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  if(params && params.access_token && params.expires_in){
    $scope.accessToken = params.access_token;
    $window.sessionStorage.accessToken = params.access_token;
    $window.sessionStorage.expiresAt = new Date(new Date().getTime() + params.expires_in * 1000).getTime();
  }
  if($window.sessionStorage.accessToken && $window.sessionStorage.expiresAt
    && ($window.sessionStorage.expiresAt > new Date().getTime())){
      //SEND REQUEST FOR USER INFORMATION HERE
  }else{
    var oauth2 = {
      url: "https://accounts.google.com/o/oauth2/auth",
      client_id: "{CLIENT_ID}",
      response_type: "token",
      redirect_uri: "localhost:3000",
      scope: "{APIs_YOU_WANT_TO_AUTHORIZE}",
      state: "initial"
    };
    $window.open(oauth2.url + "?client_id=" +
        oauth2.client_id + "&response_type=" +
        oauth2.response_type + "&redirect_uri=" +
        oauth2.redirect_uri + "&scope=" +
        oauth2.scope + "&state=" +
        oauth2.state
        ,"_self");

});*/



/*end of dat shit*/


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
    
  }])
  .controller('LoginController', ['auth', '$location', function(auth, $location){
    
    /*if($location.hash()){
      var at = auth.getOAuthParams().access_token;
      auth.setToken(at);
      console.log(at);
    }*/
  }])