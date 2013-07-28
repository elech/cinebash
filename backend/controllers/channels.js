var _ = require('lodash');
module.exports = function(io){

	function _list(req, res){
		var channels = Object.keys(io.sockets.manager.rooms);
		var channelsSubbed = _.map(channels, function(channel){ return channel.substring(1) });
		res.send({channels: channelsSubbed.filter(likeQuery)});
		
		function likeQuery(element, index, array){
			return new RegExp(req.query.name).test(element) && element != "";
		}
	}


	return{
		list: _list
	}
}
