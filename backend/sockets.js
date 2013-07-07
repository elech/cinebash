var mongoose = require('mongoose');
var https = require('https');
module.exports = function(server){
	var io = require('socket.io').listen(server);
	io.set('authorization', function(hs, cb){
		if(hs.query.name){
			hs.name = hs.query.name;
			mongoose.model('Channel').findOne({name: hs.name})
			.exec(function(err, channel){
				if(err || channel != null) cb(null, false)
				cb(null, true)
			})
		} else if(hs.query.auth){
			https.get("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token="+hs.query.auth, function(res){
				var data ="";
				res.on('data', function(ck){
					data += ck;
				})
				res.on('end', function(){
					var email = JSON.parse(data).email;
					console.log("Found the email: "+ email);
					findUserThenChannel(hs, cb, email);
				})
			})
		}
	});

	function findUserThenChannel(hs, cb, email){
		mongoose.model('User').findOne({email: email})
		.exec(function(err, user){
			if(err) cb(null, false);
			console.log("Found user");
			console.log(user);
			mongoose.model('Channel').findOne({_owner: user._id})
			.populate('_owner')
			.exec(function(err, channel){
				if(err) cb(null, false)
				console.log('Found channel: ' + channel._owner.name);
				hs.name = channel.name;
				cb(null, true);
			})
		})
	}

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