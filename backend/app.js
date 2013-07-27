var express = require('express'),
	mongoose = require('mongoose'),
	app = express(),
	fs = require('fs'),
	models = fs.readdirSync('./models');



var server = require('http').createServer(app);
var io = require('./sockets.js')(server);


for(var i in models){
	require("./models/" + models[i]);
}

//bootstrap your routes

if(mongoose.connection.readyState == 0){
	//mongoose.connect('mongodb://matt:goodteam@ec2-54-218-214-218.us-west-2.compute.amazonaws.com:27015/dev');	
	//ssh -i e.pem ubuntu@ec2-54-218-214-218.us-west-2.compute.amazonaws.com
	mongoose.connect('mongodb://localhost/dev');	
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('opened');
});


app.use(express.bodyParser());
app.use(express.static(__dirname + '/public/app/'))
require('./routes.js')(app, io);
app.post('/channels/:name/player', function(req, res){
	io.sockets.in(req.body.channel).emit('player:' +req.body.action, {});
	res.send(200);
})


server.listen(3000);
module.exports = app;