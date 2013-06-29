/*
	This is how require works, theres a few other ways, but basically
	this handles what your giving to the developer when they
	require your package, here, we return an object that has a few
	functions
*/
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	paginator = require('../util/paginator.js'),
	_ = require('lodash');


module.exports = function(){
	function _create(req, res){
		var user = new User({
			name : req.body.name,
			email : req.body.email
		});
		user.save(function(err, savedUser){
			if(err){ 
				res.send(400);
			} else {
				res.send(201, savedUser);
			}
		});
	}

	function _list(req, res){
		var dbParams = userParams(req.query),
			pagination = paginator.paginate(req.query);
		var dbQuery = User.find(dbParams, null, pagination);
		var queryString = paginator.generatePagination(dbParams, pagination);
		dbQuery.exec(function(err, users){
			if(err) res.send(503);
			res.json({
				"users" : users,
				pagination : {
					next: "https://" + req.headers.host + req.route.path + queryString.next,
					prev: "https://" + req.headers.host + req.route.path + queryString.prev
				}
			});
		});
	}

	function _byID(req, res){
		//might want to reconsider
		//what we use for ID, see the related test for an example
		//of what mongo uses for IDs
		var id = req.params.id;
		User.findById(id, function(err, user){
			if(err) res.send(404);
			res.send(user);
		});
	}

	function _edit(req, res){
		var id = req.params.id;
		User.findById( id, function(err, user){
			if(err){ res.send(500); }
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;
			user.save(function(err){
				if(err) res.send(500);
				res.send(200, user);
			});
		});
	}

	function _del(req, res){
		var id = req.params.id;
		User.findByIdAndRemove(id, function(err){
			if(err) res.send(404);
			res.send(200);
		});
	}

	function userParams(query){
		var permit = ["name", "email"];
		var dbParams = {};
		_.map(permit, function(param){
			if(query[param]){
				dbParams[param] = new RegExp(query[param], "i");
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