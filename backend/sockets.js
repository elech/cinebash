module.exports = function(server){
	var io = require('socket.io').listen(server);
	io.set('authorization', function(hs, cb){
		//Check that a name was sent to server
		//and that there are currently no sockets with this channel name
		if(hs.query.name != null && io.sockets.clients(hs.query.name).length === 0){
			hs.name = hs.query.name;
			cb(null, true)
		} else{
			cb(null, false);
		}
	});
	io.sockets.on('connection', function(socket){
		console.log("Socket connected");
		attachCommonSocketListeners(socket);
	});

	function attachCommonSocketListeners(socket){
		socket.join(socket.handshake.name);
		socket.on('dc', function(){
			socket.removeAllListeners('news');
			socket.leave(socket.handshake.name);
			socket.disconnect();
		})
		socket.emit('news', {hello: socket.handshake.name});
	}

	return io;
}