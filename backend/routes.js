module.exports = function(app, io){
	var songs = require('./controllers/songs.js')(io);
	var channels = require('./controllers/channels.js')(io);
	function channelExists(req, res, next){
		if(io.sockets.clients(req.params.name).length > 0){
			next();
		} else{
			res.send(404);
		}
	}
	/*
		Songs
	*/
	app.get('/channels/:name/songs', channelExists, songs.list);
	app.post('/channels/:name/songs', channelExists, songs.create);
	app.delete('/channels/:name/songs/:hash', channelExists, songs.del);

	/*
		Actions
	*/
	app.post('/channels/:name/actions', channelExists, function(req, res){
		io.sockets.in(req.body.channel).emit('action:' + req.body.action, {});
		res.send(200);
	})

	/*
		Channels
	*/
	app.get('/channels', channels.list);
}