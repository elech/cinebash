var expect = require('chai').expect,
	mongoose = require('mongoose'),
	_ = require('lodash'),
	PlaylistSchema = require('../../../models/playlist.js'),
	SongSchema = require('../../../models/song.js');


describe('Playlist model', function(){
	var Playlist;
	beforeEach(function(){
		Playlist = mongoose.model('Playlist', PlaylistSchema);
		if(mongoose.connection.readyState == 0){
			mongoose.connect('mongodb://matt:goodteam@ec2-54-218-214-218.us-west-2.compute.amazonaws.com:27015/dev');	
		}
	});
	afterEach(function(){
		mongoose.models = {};
		mongoose.modelSchemas = {}
	})
	describe('model', function(){
		it('should be creatable', function(done){
			var pl = new Playlist({
				name: 'Party list bro'
			});
			pl.save(function(err, saved){
				if(err) return done(err);
				expect(saved._id).to.exist;
				saved.remove(function(err, deleted){
					if(err) return done(err);
					done();
				})
			});
		})

		it('should have songs array', function(done){
			var pl = new Playlist({
				name: 'party list bro'
			});
			pl.songs.push({id: 'lsdga'});
			done();

			pl.save(function(err, pl){
				if(err) return done(err);
				pl.songs.push({id: 'adgasg'});
				pl.save(function(err, pl){
					if(err) return done(err);
					expect(pl.songs.length).to.be.above(0);
					pl.remove(function(err, pl){
						done();
					})
				})
			})
		})

	})
})