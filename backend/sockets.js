module.exports = function(server){
	var io = require('socket.io').listen(server);
	io.set('authorization', function(handShakeData, cb){
		if(handShakeData.query.Basic == 'derp'){
			handShakeData.name = "myAuthenticatedChannelName";
			cb(null, true)
		} else {
			cb(null, false);
		}
	})

	io.sockets.on('connection', function(socket){	
		socket.join(socket.handshake.name);
		socket.emit('news', {hello: "world"});
		socket.on('ev', function(data){
		});
	})

	return io;
}