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

  directive('playlist', [function(){
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
  
  .directive('mobileSearchlist', ['$http', 'youTubeHandler', 'nowPlayingList', function($http, yth, np){
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
          $http.post('http://192.168.15.187:3000/songs', {id: $scope.searchSongs[ndx].id})
          .success(function(data, status, headers){
            alert('successed');
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
;