'use strict';

angular.module('myApp.services', ['ngResource'])
  .factory('youTubeHandler', ['$http', function($http){
  	var songs = [];
  	var yth = {};

  	yth.getSongs = function(){
  		return songs;
  	}

  	yth.setSongs = function(items){
  		songs = items
  	}

  	yth.pop = function(){
  		return songs.shift();
  	}

  	yth.search = function(q){
        return $http.jsonp("https://gdata.youtube.com/feeds/api/videos?q=" + q.split(" ").join("+") + "&alt=jsonc&max-results=15&v=2&callback=JSON_CALLBACK")
    }

    yth.push = function(){
    	if('object' === typeof arguments[0]){

    	} else if('string' === typeof arguments[0]){

    	}
    }
  	return yth;
  }])
  .factory('youTubeSong', ['$http', function($http){
  	var Song = {};
    
    Song.getYTData = function() {
  		if(this.id != undefined){
        return $http.get("https://gdata.youtube.com/feeds/api/videos/" + this.id +"?v=2&alt=json")
      } else {
        throw new Error('No id');
      }
  	}

    Song.parseYTData = function(data){
      this.title = data.entry.title.$t;
      this.id = data.entry.media$group.yt$videoid.$t;
      this.description = data.entry.media$group.media$description.$t;
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
      ytp.safeApply(function(){
        ytp.player.playVideo();
      })
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
      ytp.ended();
    }

    ytp.onStateChange = function(state){
      console.log("State changed to: " + state.data);
      if(state.data === 0){
        ytp.ended();
      }
    }

    ytp.safeApply = function(fn){
      var phase = $rootScope.$$phase;
      if(phase == '$apply' || phase == '$digest')
        $rootScope.$eval(fn);
      else
        $rootScope.$apply(fn);
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
      songs = items
    }

    np.pop = function(){
      return songs.shift();
    }

    np.push = function(id){
      var song = Object.create(yts);
      song.id = id;
      np.safeApply(function(){
        song.getYTData().success(function(data, status, headers){
              song.parseYTData(data)
              np.getSongs().push(song);
        });
      });
    }

    np.safeApply = function(fn){
      var phase = $rootScope.$$phase;
      if(phase == '$apply' || phase == '$digest')
        $rootScope.$eval(fn);
      else
        $rootScope.$apply(fn);
    }

    return np;
  }])
  .factory('socket', ['nowPlayingList', "youTubePlayer", "auth", '$route', '$rootScope', function(np, ytp, auth, $route, $rootScope){
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
        //this is where the oauth magic happenz
        //needs to be ssl also i guess...
        //cuz we got access token in get params lulz
        if(socket){
          socket.socket.reconnect();
          status = true;

        } else {
          if(auth.getToken() != null){
            console.log('first one');
            socket = io.connect('http://localhost:3000', {query: "auth=" + auth.getToken()});

          } else{
            socket = io.connect('http://localhost:3000', {query: "name=" + $route.current.params.name});
          }
          attachListeners();
        }
      }

      function attachListeners(){
        socket.on('song:add', function(data){
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

        socket.on('player:play', function(){
          console.log('he bout to play')
          ytp.play();
        })

        socket.on('player:pause', function(){
          console.log('he bout to puase')
          ytp.pause();
        })

        socket.on('player:next', function(){
          console.log('player bout to next');
          ytp.next();
        })
      }

      return socketHandler;
  }])
  .factory('auth', ['$q', '$rootScope', function($q, $rootScope){
    var config = {};
    var auth = {};
    var access_token;
    var popup = window;
    var channelName = "";

    config.client_id = "730381482631.apps.googleusercontent.com";
    config.response_type = "token"
    config.redirect_uri = "http://localhost:3000/app/login.html";

    auth.getGoogleProvider = function(){
      var authEndpointHost = "https://accounts.google.com/o/oauth2/auth";
      var authEndpointURL = authEndpointHost + "?";
      for(var prop in config){
        authEndpointURL += "&" + prop + "=" + config[prop];
      }
      authEndpointURL += "&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"; 
      popup.open(authEndpointURL);
      return listenForMessage(popup);
    }

    auth.getTokenFromProvider = function(){
      //var popup = window.open()
    }
    auth.getToken = function(){
      return access_token;
    }

    auth.setProvider = function(prov){
      provider = prov;
    }

    auth.getProvider = function(){
      return provider;
    }
    auth.setToken = function(token){
      access_token = token;
    }

    auth.getChannelName = function(){
      return channelName;
    }

    auth.setChannelName = function(cn){
      channelName = cn;
    }

    auth.getOAuthParams = function(){
      var oauthParams = {};
      // parse the query string
      var params = {}, queryString = location.hash.substring(1),
        regex = /([^&=]+)=([^&]*)/g, m;
      while (m = regex.exec(queryString)) {
        oauthParams[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
      }
      return oauthParams
    }

    function listenForMessage(popup){
      var deferred = $q.defer();

      angular.element(popup).bind('message', function(ev){
        if(ev.origin === "http://localhost:3000"){
          auth.setToken(ev.data.access_token);
          deferred.resolve(ev.data);
          $rootScope.$apply();
          angular.element(popup).unbind('message');
        }
      })
      return deferred.promise;
    } 

    return auth;
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