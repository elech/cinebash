'use strict';

angular.module('myApp.directives', [])
  .directive('playlist', ['nowPlayingList', '$timeout', function(np, $timeout){
    return {
      restrict: 'E',
      controller: function(){
      },
      template: "<div class='playlistContainer'><ul><li ng-repeat=\"song in songs\" style=\"height:100px\"><song song=\"song\"></song></li></ul>",
      link: function(scope, elems, attr){
      }
    }
  }])
  .directive('searchlist', ['$http', 'youTubeSong', 'nowPlayingList', function($http, yts, np){
    return {
      restrict: 'E',
      scope:{
        playlist: '=',
        songs: '='
      },
      controller: function($scope){
        $scope.q;
        $scope.search = function(){
          yts.search($scope.q).success(function(data, status, headers){
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
  
  .directive('mobileSearchlist', ['$http', 'youTubeSong', 'nowPlayingList', '$route', '$timeout', function($http, yts, np, $route, $timeout){
    return {
      restrict: 'E',
      controller: function($scope){
        $scope.q;
        $scope.search = function(){
          yts.search($scope.q).success(function(data, status, headers){
            $scope.searchSongs = data.data.items;
          });
        }        
      },
      template:"<input type=\"text\" name=\"q\" ng-model=\"q\"/><button class=\"btn btn-info\" ng-click=\"search()\">saerch</button><ul><li ng-repeat=\"song in searchSongs\" ng-click=\"clickfn($index)\">{{$index + 1}}<h4>{{song.title}}</h4><p>{{song.id}}</p></li></ul>",
      link: function($scope, element, attr){
        $scope.searchSongs = [];
        
        $scope.clickfn = function(ndx){
          $http({method: "POST", url: '/channels/' + $route.current.params.name + "/songs", data: {id: $scope.searchSongs[ndx].id}})
          .success(function(data, status, headers){
            $scope.playlist = true;
            $timeout(function(){
              $scope.refresh();
            }, 1000);
          })
          .error(function(data, status, headers){
            alert('failed' + status);
          })
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
  .directive('mobilePlaylist', ['nowPlayingList', '$route', 'Song', function(np, $route, SongResource){
    return{
      restrict: 'E',
      controller: function($scope){

        $scope.$watch(function(){ return np.getSongs()}, function(newSongs, OldSongs){
          $scope.songs = newSongs;
        })
      },
      template: '<div id="playlistContainer"><ul><li ng-repeat="song in songs"><song song="song"></song></li></ul></div>',
      link: function($scope, elem, attr){

      } 
    }
  }])
  .directive('song', [function(){
    return{
      restrict: 'E',
      scope: {
        song: '='
      },
      controller: function($scope){

      },
      templateUrl: 'partials/song.html'
    }
  }])