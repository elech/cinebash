var request = require('supertest'),
	app = require('../../../app.js'),
	expect = require('chai').expect,
	mongoose = require('mongoose'),
	_ = require('lodash'),
	SongSchema = require('../../../models/song.js');

describe('Song Controller', function(){
	afterEach(function(){
		mongoose.models = {};
		mongoose.modelSchemas = {};
	})

	describe('GET /songs LIST', function(){
		it('should return a 200', function(done){
			request(app)
			.get('/songs')
			.expect(200)
			.end(function(err, res){
				if(err) return done(err)
				expect(res.body.songs).to.exist;
				done();
			});
		})
	})

	describe('POST /songs', function(){
		it('should return a 201', function(done){
			request(app)
			.post('/songs')
			.send({id: 'xyzabc'})
			.expect(201)
			.end(function(err, res){
				if(err) return done(err)
				expect(res.body._id).to.exist;
				mongoose.model('Song', SongSchema).findByIdAndRemove(res.body._id, function(err, song){
					if(err) return done(err)
					done();
				})
			})
		})
	})

	describe('GET /songs/:id', function(){
		it('should return a 200', function(done){
			request(app)
			.post('/songs')
			.send({id: 'xyqetqt'})
			.expect(201)
			.end(function(err, res){
				if(err) return done(err)
				request(app)
				.get('/songs/' + res.body._id)
				.expect(200)
				.end(function(err, res){
					if(err) return done(err)
					mongoose.model('Song', SongSchema).findByIdAndRemove(res.body._id, function(err, song){
						if(err) return done(err);
						done();
					})
				})
			})
		})
	})


	describe('PUT /songs/:id', function(){
		it('should return a 200', function(done){
			var originalID;
			request(app)
			.post('/songs')
			.send({id: 'xyqetqt'})
			.expect(201)
			.end(function(err, res){
				if(err) return done(err)
				originalID = res.body.id;
				request(app)
				.put('/songs/' + res.body._id)
				.expect(200)
				.send({id: 'newid'})
				.end(function(err, res){
					expect(res.body.id).to.not.equal(originalID);
					if(err) return done(err)
					mongoose.model('Song', SongSchema).findByIdAndRemove(res.body._id, function(err, song){
						if(err) return done(err);
						done();
					})
				})
			})
		})
	})

	describe('DELETE /songs/:id', function(){
		it('should return a 200', function(done){
			request(app)
			.post('/songs')
			.send({id: 'gsadgwe'})
			.expect(201)
			.end(function(err, res){
				if(err) return done(err)
				request(app)
				.del('/songs/' + res.body._id)
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					done();
				})
			})
		})
	})



})