var request = require('supertest'),
	app = require('../../../app.js'),
	expect = require('chai').expect,
	mongoose = require('mongoose'),
	ChannelSchema = require('../../../models/channel.js'),
	_ = require('lodash')


describe('Channel Controller', function(){
	afterEach(function(){
		mongoose.models = {};
		mongoose.modelSchemas = {};
	})

	describe('GET /channels list', function(){
		it('should return a 200', function(done){
			request(app)
			.get('/channels')
			.expect(200)
			.end(function(err, res){
				if(err) return done(err)
				expect(res.body.channels).to.exist;
				done();
			})
		})
	})

	describe('POST /channels', function(){
		it('should return a 201', function(done){
			request(app)
			.post('/channels')
			.send({name: "poppinBottles3"})
			.expect(201)
			.end(function(err, res){
				if(err) return done(err)
				mongoose.model('Channel', ChannelSchema).findByIdAndRemove(res.body._id, function(err, channel){
					if(err) return done(err)
					done()
				})
			})
		})
	})

	describe('GET /channel/:id', function(){
		it('should return a 200', function(done){
			request(app)
			.post('/channels')
			.send({name: 'testNameHere2'})
			.expect(201)
			.end(function(err, res){
				if(err) return done(err)
				request(app)
				.get('/channels/' + res.body._id)
				.expect(200)
				.end(function(err, res){
					if(err) return done(err)
					mongoose.model('Channel', ChannelSchema).findByIdAndRemove(res.body._id, function(err, channel){
						if(err) return done(err);
						done();
					})
				})
			})
		})
	})

})