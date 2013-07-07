var https = require('https');
module.exports = function(app, io){
	var users = require('./controllers/users.js')();
	var songs = require('./controllers/songs.js')(io);
	var mongoose = require('mongoose');
	var User = mongoose.model('User', require('./models/user.js'));
	var channels = require('./controllers/channels.js')();


	var fakeLogin = function(req, res, next){
		var provider = req.get('X-Provider');
		//no longer a fake login
		//the access auth token must be validated for safety
		//think ;javscript::setTimeout(function())
		provider = "goog";
		switch(provider){
			case "goog":
				var access_token = req.get('Authorization').split(" ");
				https.get("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + access_token[1], function(res){
					var data = "";
					res.on('data', function(chunk){
						data += chunk;
					})
					res.on('end', function(){
						var email = JSON.parse(data).email;
						console.log("Good found the email: " + email);
						getUserData(email);
					})
				}).on('error', function(){
					console.log('errd');
				});
				break;
			case "fb":
				//do fb
				break;
			case "twit":
				//do twitter?
				break;
			default:
				next();
				//res.send(400);
		}

		function getUserData(email){
			User.findOne({email: email}, function(err, user){
				if(err) res.send(400);
				req.user = user;
				next();
			});			
		}
	}

		

	/*
		Bootstrap the users as a resource
	*/
	app.get('/users', fakeLogin,users.list);
	app.post('/users', users.create);
	app.get('/users/:id', users.byID);
	app.put('/users/:id', users.edit);
	app.delete('/users/:id', users.del);

	/*
		Songs
	*/
	app.get('/songs', songs.list);
	app.post('/songs'/*, fakeLogin*/, songs.create);
	app.get('/songs/:id', songs.byID);
	app.put('/songs/:id', songs.edit);
	app.delete('/songs/:id', songs.del);

	/*
		Channels
	*/
	app.get('/channels'/*, fakeLogin*/, channels.list);
	app.post('/channels', channels.create);
	app.get('/channels/:id', channels.byID);
	app.get('/channel', fakeLogin, channels.getChannel)


	//playlists??
	//songs??
	/*
	app.post('/channels/:name/playlist', songs.create);
	app.post('/channels/:name/playlist/:name', songs.create)
	app.get('/channels/:name/playlist', songs.list);
	app.get('/channels/:name/playlist/:name', songs.list);
	*/


	
}