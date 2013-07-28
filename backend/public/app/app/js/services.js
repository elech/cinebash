'use strict';

angular.module('myApp.services', ['ngResource'])
  .factory('youTubeSong', ['$http', function($http){
  	var Song = {};
    
    Song.getYTData = function() {
  		if(this.id != undefined){
        return $http.get("https://gdata.youtube.com/feeds/api/videos/" + this.id +"?v=2&alt=json");
      } else {
        throw new Error('No id');
      }
  	}

    Song.search = function(q){
      return $http.jsonp("https://gdata.youtube.com/feeds/api/videos?q=" + q.split(" ").join("+") + "&alt=jsonc&max-results=15&v=2&callback=JSON_CALLBACK");
    }

    Song.parseSearch = function(data){
      var searchedSongs = data.data.items, newSongs = [], tempSong;
      for(var song in searchedSongs){
        tempSong = {};
        tempSong.title = searchedSongs[song].title;
        tempSong.id = searchedSongs[song].id;
        tempSong.description = searchedSongs[song].description;
        tempSong.img = searchedSongs[song].thumbnail.hqDefault;
        newSongs.push(tempSong);
      }
      return newSongs;
    }

    Song.parseYTData = function(data){
      this.title = data.entry.title.$t;
      this.id = data.entry.media$group.yt$videoid.$t;
      this.description = data.entry.media$group.media$description.$t;
      this.img = data.entry.media$group.media$thumbnail[0].url;
      console.log(this);
    }

  	return Song;
  }])
  .factory('youTubePlayer', ['$window', 'nowPlayingList', '$rootScope', function($window, np, $rootScope){
    var ytp = {};
    //loads the youtube javascript api async
    ytp.loadScripts = function(){
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/player_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    ytp.getState = function(){
      return ytp.player.getPlayerState();
    }

    ytp.pause = function(){
      ytp.safeApply(function(){
        ytp.player.pauseVideo();
      });
    }

    ytp.play = function(){
      console.log(ytp.getState());
      if( ytp.getState() === 2
        || ytp.getState() === 5){
        ytp.safeApply(function(){
          ytp.player.playVideo();
        })
      } else{
        ytp.next();
      }
    }

    ytp.next = function(){
      if(np.getSongs().length > 0){
        ytp.safeApply(function(){
          ytp.player.loadVideoById(np.pop().id, 5, "large");
        })
      }
    }

    ytp.onYouTubePlayerAPIReady = $window.onYouTubePlayerAPIReady = function() {
      ytp.player = new YT.Player('ytplayer', {
        height: '390',
        width: '640',
        events: {
          'onReady' : ytp.onYouTubePlayerReady,
          'onStateChange' : ytp.onStateChange
        }
      });
    }

    ytp.onYouTubePlayerReady = function(){
      //ytp.ended();
    }

    ytp.onStateChange = function(state){
      console.log("State changed to: " + state.data);
      if(state.data === 0){
        ytp.ended();
      }
    }

    ytp.safeApply = function(fn){
      var phase = $rootScope.$$phase;
      if(phase == '$apply' || phase == '$digest'){
        $rootScope.$eval(fn);
      } else{
        $rootScope.$apply(fn);
      }
    }

    ytp.ended = function(){
      console.log("Inside ended " + "np songs length " + np.getSongs().length);
      if(np.getSongs().length > 0){
        ytp.safeApply(ytp.player.loadVideoById(np.pop().id, 0, "large"));
      }
    }

    return ytp;
  }])
  .factory('nowPlayingList', ['youTubeSong', '$rootScope', function(yts, $rootScope){
    var np = {};
    var songs = [];
    
    np.getSongs = function(){
      return songs;
    }

    np.setSongs = function(items){
      np.safeApply(function(){
        songs = items
      });
    }

    np.pop = function(){
      return songs.shift();
    }

    np.push = function(id){
      var song = Object.create(yts);
      song.id = id;
      np.safeApply(function(){
        song.getYTData().success(function(data, status, headers){
              song.parseYTData.call(song, data);
              np.getSongs().push(song);
        });
      });
    }

    np.remove = function(hash){
      np.safeApply(function(){
        songs.forEach(function(song, ndx){
          if(song.$$hashKey === hash){
            songs.splice(ndx, 1);
          }
        })
      })
    }

    np.safeApply = function(fn) {
      var phase = $rootScope.$$phase;
      if(phase == '$apply' || phase == '$digest')
        $rootScope.$eval(fn);
      else
        $rootScope.$apply(fn);
      };

    return np;
  }])
  .factory('socket', ['nowPlayingList', "youTubePlayer", '$route', '$rootScope', '$location', function(np, ytp, $route, $rootScope, $location){
      var socketHandler = {};
      var socket;
      var status = false;
      socketHandler.getStatus = function(){
        //true if connect, false otherwise
        return status;
      }

      socketHandler.disconnect = function(){
        socket.emit("dc");
        status = false;
      }
      socketHandler.connect = function(){
        if(socket){
          socket.socket.reconnect();
          status = true;
        } else {
          socket = io.connect($location.host(), {query: "name=" + $route.current.params.name});
          attachListeners();
        }
      }

      function attachListeners(){
        socket.on('connect_failed', function(data){
          //
        })

        socket.on('connect_error', function(){
          $rootScope.$apply(function(){});
        })

        socket.on('disconnect', function(){
          $rootScope.$apply(function(){});
        })

        socket.on('error', function(data){
          $rootScope.$apply(function(){
            $location.path('/');
          })
        })

        socket.on('songs:create', function(data){
          np.push(data.id);
          console.log("Got data id: " + data.id);
        })

        socket.on('connect', function(){
          console.log('connected');
          $rootScope.$apply(function(){
            status = true;
          });
        })

        socket.on('news', function(data){
          console.log(data.hello);
        })

        socket.on('action:play', function(){
          console.log('he bout to play')
          ytp.play();
        })

        socket.on('action:pause', function(){
          console.log('he bout to puase')
          ytp.pause();
        })

        socket.on('action:next', function(){
          console.log('player bout to next');
          ytp.next();
        })

        socket.on('songs:list', function(){
          socket.emit('songs:send', np.getSongs());
        })

        socket.on('songs:del', function(data){
          np.remove(data.hash);
        })
      }

      return socketHandler;
  }])
  .factory('Channel', ['$resource', function($resource){
    var ChannelResource = $resource('/channels/:channelId', {}, {
      'query': {method: 'GET', isArray: false},
      'get': {method: 'GET'}
    })

    return ChannelResource;
  }])
  .factory('User', ['$resource', 'auth', function($resource, auth){
    var UserResource = $resource('/users/:userId', {}, {
      'query': {method: 'GET', isArray: false},
      'get': {method: 'GET', headers: {"Authorization": "Bearer " + auth.getToken()}}
    })

    return UserResource;
  }])
  .factory('Song', ['$resource', function($resource){
    var SongResource = $resource('/channels/:name/songs', {}, {
      'query': {method: 'GET', isArray: true}
    })
    return SongResource;
  }])