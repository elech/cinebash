var mongoose = require('mongoose');
var https = require('https');
module.exports = function(server){
	var io = require('socket.io').listen(server);
	io.set('authorization', function(hs, cb){
		if(hs.query.name){
			hs.name = hs.query.name;
			mongoose.model('Channel').findOne({name: hs.query.name})
			.exec(function(err, channel){
				if(err) console.log(err)
				if(channel == null){
					//no channel by that name, allow temp use
					cb(null, true)
				} else{
					if(hs.query.auth){
						https.get("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + hs.query.auth, function(res){
							var data = "";
							
							res.on('data', function(chunk){
								data += chunk;
							})

							res.on('end', function(){
								var email = JSON.parse(data).email;
								mongoose.model('User').findOne({email: email}, function(err, user){
									//note how to compare objectIds from mongo/mongoose
									if(user._id.equals(channel._owner)){
										cb(null, true)
									} else{
										//not your channel bro!
										cb(null, false);
									}
								})
							})

						}).on('error', function(){
							console.log('errd');
							cb(null, false);
						});
					} else{
						cb(null, false);	
					}
				}
			})
		}
	})

	io.sockets.on('connection', function(socket){
		attachCommonSocketListeners(socket);
	});

	function attachCommonSocketListeners(socket){
		socket.emit('news', {hello: socket.handshake.name});
		socket.on('ev', function(data){
			console.log(data);
		});
	}

	return io;
}