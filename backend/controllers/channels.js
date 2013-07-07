var mongoose = require('mongoose'),
	Channel = mongoose.model('Channel'),
	paginator = require('../util/paginator.js'),
	_ = require('lodash')


module.exports = function(){
	function _create(req, res){
		var channel = new Channel({
			name: req.body.name,
			_owner: mongoose.Types.ObjectId(req.body.ownerId)
		})

		channel.save(function(err, channel){
			if(err) res.send(503)
			res.send(201, channel);
		})
	}

	function _list(req, res){
		var dbParams = userParams(req.query),
			pagination = paginator.paginate(req.query);
		var queryString = paginator.generatePagination(dbParams, pagination);
		var dbQuery = Channel.find(dbParams, null, pagination);
		
		dbQuery.exec(function(err, channels){
			if(err) res.send(503);
			res.send(200,{
				channels: channels,
				pagination: {
					next: "https://" + req.headers.host + req.route.path + queryString.next,
					prev: "https://" + req.headers.host + req.route.path + queryString.prev
				}
			});
		});
	}

	function _byID(req, res){
		var id = req.params.id;
		var select;
		

		//req.user = true;
		req.user ? select = "_id name email" : select = "_id name"; 
		console.log(select);
		Channel.findOne({name: id})
		.populate({path: "_owner", select: select})
		.exec(function(err, channel){
			if(err) res.send(503)
			//TODO do not display the channel owners user email if
			//the channe does not belong to the user
			if(channel == null) res.send(404);
			res.send(200, channel);
		})
	}

	function userParams(query){
		var permit = ["name"];
		var dbParams = {};
		_.map(permit, function(param){
			if(query[param]){
				dbParams[param] = new RegExp(query[param], "i");
			}
		})
		return dbParams;
	}

	function _getChannel(req, res){
		Channel.findOne({_owner: req.user._id})
		.populate('_owner')
		.exec(function(err, channel){
			if(err) res.send(503)
			res.send(200, channel);
		})
	}

	return {
		create : _create,
		list : _list,
		byID : _byID,
		getChannel: _getChannel
	}
}