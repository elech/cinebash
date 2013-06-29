var mongoose = require('mongoose'),
	Schema = mongoose.Schema


var ChannelSchema = new mongoose.Schema({
	name: {type: String, required: true, unique: true},
	playlists: [{type: Schema.Types.ObjectId, ref: 'Playlist'}],
	_user: {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = ChannelSchema;
mongoose.model('Channel', ChannelSchema);