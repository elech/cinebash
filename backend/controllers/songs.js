/*
	This is how require works, theres a few other ways, but basically
	this handles what your giving to the developer when they
	require your package, here, we return an object that has a few
	functions
*/
var mongoose = require('mongoose'),
	Song = mongoose.model('Song'),
	User = mongoose.model('User'),
	paginator = require('../util/paginator.js'),
	_ = require('lodash')


module.exports = function(io){
	function _create(req, res){
		var song = new Song({
			id: req.body.id, 
			_user: req.user._id || null
		})
		//check if theres a socket connected
		//then send the song to the client
		//and finally save for history
		if(io.sockets.clients(req.body.channel).length > 0){
			io.sockets.in(req.body.channel).emit('song:add', {id: req.body.id});
			song.save(function(err, song){
				if(err) res.send(503)
				res.send(201, song);
			})
		} else {
			//chatroom not playing
			res.send(404);
		}
	}

	function _list(req, res){
		var dbParams = userParams(req.query),
			pagination = paginator.paginate(req.query);
		var queryString = paginator.generatePagination(dbParams, pagination);
		var dbQuery = Song.find(dbParams, null, pagination).populate('_user');
		
		dbQuery.exec(function(err, songs){
			if(err) res.send(503);
			var resObj = {
				songs: songs,
				pagination: {
					next: "https://" + req.headers.host + req.route.path + queryString.next,
					prev: "https://" + req.headers.host + req.route.path + queryString.prev
				}
			}
			res.send(200, resObj);
		});
	}

	function _byID(req, res){
		var id = req.params.id;
		Song.findById(id, function(err, song){
			if(err) res.send(404);
			res.send(song);
		});
	}

	function _edit(req, res){
		var id = req.params.id;
		Song.findById(id, function(err, song){
			if(err) res.send(500);
			song.id = req.body.id || song.id;
			song.save(function(err){
				if(err) res.send(500)
				res.send(200, song);
			})
		})
	}

	function _del(req, res){
		var id = req.params.id;
		Song.findByIdAndRemove(id, function(err){
			if(err) res.send(404)
			res.send(200);
		})
	}

	function userParams(query){
		var permit = ["playlist", "user"];
		var dbParams = {};
		_.map(permit, function(param){
			if(query[param]){
				dbParams["_"+param] = new RegExp(query[param], "i");
			}
		})
		return dbParams;
	}

	return {
		create : _create,
		list : _list,
		byID : _byID,
		edit : _edit,
		del : _del
	}
}