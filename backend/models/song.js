var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	UserSchema = require('./user.js');

var SongSchema = new mongoose.Schema({
	id: {type: String, required: true},
	_user: {type: Schema.Types.ObjectId, ref: 'User'},
	_playlist: {type: Schema.Types.ObjectId, ref: 'Playlist'},
	created: {type: Date, default: Date.now},
	updated: {type: Date, default: Date.now}
})

SongSchema.pre('save', function(next){
	this.updated = new Date();
	next();
})

module.exports = SongSchema;
mongoose.model('Song', SongSchema);