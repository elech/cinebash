var mongoose = require('mongoose'),
	Song = mongoose.model('Song'),
	User = mongoose.model('User'),
	paginator = require('../util/paginator.js'),
	_ = require('lodash')


module.exports = function(io){
	function _create(req, res){
		if(req.body.id != null){
			io.sockets.in(req.query.name).emit('songs:create', {id: req.body.id});
			res.send(201);
		} else{
			res.send(400);
		}
	}

	function _list(req, res){
		var socket = io.sockets.clients(req.query.name)[0]
		socket.emit('songs:list', {});
		socket.once('songs:send', function(data){
			res.send(data);
		});
	}

	function _del(req, res){
		io.sockets.in(req.query.name).emit('songs:del', {hash: req.params.hash})
		res.send(200);
	}

	return{
		create: _create,
		list: _list,
		del: _del
	}
}