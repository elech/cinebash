
module.exports = function(app, io){
	var users = require('./controllers/users.js')();
	var songs = require('./controllers/songs.js')(io);
	var mongoose = require('mongoose');
	var User = mongoose.model('User', require('./models/user.js'));
	var channels = require('./controllers/channels.js')();


	var fakeLogin = function(req, res, next){
		User.findOne({}, function(err, user){
			if(err) {
				console.log(err)
				res.send(400);
			}
			req.user = user;
			next();
		});
	}

	/*
		Bootstrap the users as a resource
	*/
	app.get('/users', users.list);
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
	app.get('/channels', channels.list);
	app.post('/channels', channels.create);
	app.get('/channels/:id', channels.byID);


	//playlists??
	//songs??
	/*
	app.post('/channels/:name/playlist', songs.create);
	app.post('/channels/:name/playlist/:name', songs.create)
	app.get('/channels/:name/playlist', songs.list);
	app.get('/channels/:name/playlist/:name', songs.list);
	*/


	
}