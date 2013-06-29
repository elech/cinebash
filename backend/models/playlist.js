var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	SongSchema = require('./song.js');

var PlaylistSchema = new mongoose.Schema({
	name: {type: String, required: true},
	songs: [{type: Schema.Types.ObjectId, ref: 'Song'}]
})

module.exports = PlaylistSchema;
mongoose.model('Playlist', PlaylistSchema);