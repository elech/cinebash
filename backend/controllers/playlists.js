module.exports = function(io){
	function _list(req, res){
		var socket = io.sockets.clients(req.query.channelName)[0];
		socket.emit('playlist:get', {});
		socket.once('playlist:send', function(data){
			res.send(200, data);
		})
	}
	return{
		list: _list
	}
}