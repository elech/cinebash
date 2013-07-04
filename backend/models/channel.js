var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	UserSchema = require('./user.js');


var ChannelSchema = new mongoose.Schema({
	name: {type: String, required: true, unique: true},
	_owner: {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = ChannelSchema;
mongoose.model('Channel', ChannelSchema);