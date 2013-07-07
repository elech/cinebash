'use strict';

angular.module('myApp.directives', [])
  .directive('myTest', [ function(){
	return {
        restrict: 'A',
        template: '<div class="mydirectiveclass"><h1>hello...</h1><p ng-repeat="obj in arr">{{obj}}</p></div>',
        link: function (scope, elems, attr) {
            var elly = angular.element(document.querySelector('.span10'));
            elems.css({'background-color' : 'red', 'display' : 'block'});
        }
    };
  }]).

  directive('playlist', ['nowPlayingList', '$timeout', function(np, $timeout){
    return {
      restrict: 'E',
      controller: function(){
      },
      template: "<div class='playlistContainer'><ul><li ng-repeat=\"song in songs\" style=\"height:100px\"><p>{{song.title}}</p></li></ul>",
      link: function(scope, elems, attr){
      }
    }
  }])

  .directive('searchlist', ['$http', 'youTubeHandler', 'nowPlayingList', function($http, yth, np){
    return {
      restrict: 'E',
      scope:{
        playlist: '=',
        songs: '='
      },
      controller: function($scope){
        $scope.q;
        $scope.search = function(){
          yth.search($scope.q).success(function(data, status, headers){
            $scope.searchSongs = data.data.items;
          });
        }        
      },
      template:"<input type=\"text\" name=\"q\" ng-model=\"q\"/><button class=\"btn btn-info\" ng-click=\"search()\">saerch</button><ul><li ng-repeat=\"song in searchSongs\" ng-click=\"clickfn($index)\">{{$index + 1}}<h4>{{song.title}}</h4><p>{{song.id}}</p></li></ul>",
      link: function($scope, element, attr){
        $scope.searchSongs = [];
        
        $scope.clickfn = function(ndx){
          $scope.songs.push({title : $scope.searchSongs[ndx].title, id : $scope.searchSongs[ndx].id});
          $scope.playlist = true;
          $scope.q = "";
          $scope.searchSongs.length = 0;
        }
      }
    }
  }])
  
  .directive('mobileSearchlist', ['$http', 'youTubeHandler', 'nowPlayingList', 'auth', function($http, yth, np, auth){
    return {
      restrict: 'E',
      scope:{
        playlist: '=',
        songs: '='
      },
      controller: function($scope){
        $scope.q;
        $scope.search = function(){
          yth.search($scope.q).success(function(data, status, headers){
            $scope.searchSongs = data.data.items;
          });
        }        
      },
      template:"<input type=\"text\" name=\"q\" ng-model=\"q\"/><button class=\"btn btn-info\" ng-click=\"search()\">saerch</button><ul><li ng-repeat=\"song in searchSongs\" ng-click=\"clickfn($index)\">{{$index + 1}}<h4>{{song.title}}</h4><p>{{song.id}}</p></li></ul>",
      link: function($scope, element, attr){
        $scope.searchSongs = [];
        
        $scope.clickfn = function(ndx){
          $http({method: "POST", url: 'http://localhost:3000/songs', data: {id: $scope.searchSongs[ndx].id}, headers: {"Authorization": "Bearer " + auth.getToken()}})
          .success(function(data, status, headers){
            $scope.playlist = true;
          })
          .error(function(data, status, headers){
            console.log(data);
            console.log(status);
            alert('failed' + status);
          })
/*          $scope.songs.push({title : $scope.searchSongs[ndx].title, id : $scope.searchSongs[ndx].id});
          $scope.playlist =1 true;
          $scope.q = "";
          $scope.searchSongs.length = 0;*/
        }
      }
    }
  }])
  .directive('loginPane', ['auth', function(auth){
    return{
      restrict: 'E',
      controller: function($scope){
        $scope.checkForLogin = function(){
        }
        
        $scope.login = function(){
          auth.getGoogleProvider().then(function(){
            $scope.isLoggedIn = true;
          })
        }

        $scope.logout = function(){
          auth.setToken(null);
          $scope.isLoggedIn = false;
        }
      },
      templateUrl: "partials/loginPane.html",
      link: function($scope, elem, attr){
        auth.getToken() == null ? $scope.isLoggedIn = false : $scope.isLoggedIn = true 
      }
  }
  }])
  .directive('mobilePlaylist', ['nowPlayingList', '$http', function(np, $http){
    return{
      restrict: 'E',
      scope: {
        playlist: "="
      },
      controller: function($scope){
        $scope.songs = np.getSongs();

        $scope.$watch(function(){ return np.getSongs()}, function(songs){
          $scope.songs = songs;
        })
        $scope.refresh = function(){
          $http({method: "GET", url: "http://localhost:3000/playlists", params: {channelName: "ericsChannel2"}})
          .success(function(data, status, headers){
            np.setSongs(data);
            //$scope.songs = np.getSongs();
          })
          .error(function(){
            alert('errored');
          })
        }

      },
      template: '<div id="playlistContainer"><button class="btn btn-inverse" ng-click="refresh()">refresh</button><ul><li ng-repeat="song in songs">{{song.title}}</li></ul></div>',
      link: function($scope, elem, attr){

      } 
    }
  }])
;