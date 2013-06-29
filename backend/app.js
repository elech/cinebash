var express = require('express'),
	mongoose = require('mongoose'),
	app = express(),
	fs = require('fs');
require('./models/user.js');
var User = mongoose.model('User');

//load models

var files = fs.readdirSync('./models');
for(var i in files){
	require("./models/" + files[i]);
}
/*fs.readdir('./models', function(files){
	if(err) console.log(err);
	for(var i in files){
		console.log(files[i]);
		require(files[i]);
	}
});*/

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

/* configs, can be put in another file eventually */
//allows you to get post variables
app.use(express.bodyParser());
//needed for legacy support of DELETE http method
app.use(express.methodOverride());
app.use(express.static(_dirname + '../frontend/app'))

//bootstrap your routes

require('./routes.js')(app);

app.listen(3000);
module.exports = app;
