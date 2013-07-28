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
            if($scope.socketOnline == null){
              $scope.refresh(5000);
            }
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