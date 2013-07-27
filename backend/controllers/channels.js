var _ = require('lodash');
module.exports = function(io){

	function _list(req, res){
		var channels = Object.keys(io.sockets.manager.rooms);
		res.send({channels: channels.filter(likeQuery)});

		function likeQuery(element, index, array){
			return new RegExp(req.query.name).test(element.substring(1)) && element != "";
		}
	}

	return{
		list: _list
	}
}