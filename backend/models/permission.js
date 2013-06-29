var mongoose = require('mongoose');

var Permission = new mongoose.Schema({
	name : {type: String, required: true},
	risk : {type: Number, required: true, min: 0, max: 5}
})