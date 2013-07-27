'use strict';

angular.module('myApp.directives', [])
  .directive('playlist', ['nowPlayingList', '$timeout', function(np, $timeout){
    return {
      restrict: 'E',
      template: "<div class='playlistContainer'><ul><li ng-class-even=\"'songContainerEven'\" ng-class-odd=\"'songContainerOdd'\" ng-repeat=\"song in songs\"><song song=\"song\"></song></li></ul>",
      link: function(scope, elems, attr){

      }
    }
  }])
  .directive('searchlist', ['$http', 'youTubeSong', '$route', function($http, yts, $route){
    return {
      restrict: 'E',
      template:"<ul><li ng-class-even=\"'songContainerEven'\" ng-class-odd=\"'songContainerOdd'\" ng-repeat=\"song in searchSongs\" ng-click=\"clickfn($index)\"><song song=\"song\"></song></li></ul>",
      link: function($scope, element, attr){
        $scope.clickfn = function(ndx){
          $http({method: "POST", url: '/channels/' + $route.current.params.name + "/songs", data: {id: $scope.searchSongs[ndx].id}})
          .success(function(data, status, headers){
            $scope.tabs[0].active = true;
            $scope.searchSongs.length = 0;
          })
          .error(function(data, status, headers){
            alert('failed' + status);
          })
        }

      }

    }
  }])
  
  .directive('mobileSearchlist', ['$http', 'youTubeSong', 'nowPlayingList', '$route', '$timeout', function($http, yts, np, $route, $timeout){
    return {
      restrict: 'E',
      template:"<ul><li ng-repeat=\"song in searchSongs\" ng-click=\"clickfn($index)\"><song song=\"song\"></song></li></ul>",
      link: function($scope, element, attr){
        
        $scope.clickfn = function(ndx){
          $http({method: "POST", url: '/channels/' + $route.current.params.name + "/songs", data: {id: $scope.searchSongs[ndx].id}})
          .success(function(data, status, headers){
            //needs a timeout during local
            console.log($scope.socketOnline);
            $scope.refresh(5000);
            $scope.tabs[0].active = true;
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