var express = require('express'),
	app = express(),
	fs = require('fs'),

var server = require('http').createServer(app);
var io = require('./sockets.js')(server);

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'))
require('./routes.js')(app, io);


server.listen(3000);
module.exports = app;