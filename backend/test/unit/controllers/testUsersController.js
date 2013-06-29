/*
	Test sample
*/

var request = require('supertest'),
	app = require('../../../app.js'),
	expect = require('chai').expect,
	mongoose = require('mongoose'),
	_ = require('lodash');
	require('../../../models/user.js');
	var User = mongoose.model('User');

describe('the users resource', function(){
	afterEach(function(){
		mongoose.models = {};
		mongoose.modelSchemas = {};
	})

	describe('GET /users', function(){
		it('should respond 200', function(done){
			request(app)
				.get('/users')
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					done();
				});
		});
		describe('the response', function(){
			it('should contain a users array', function(done){
				request(app)
					.get('/users')
					.expect(200)
					.end(function(err, res){
						if(err) return done(err);
						expect(res.body.users).to.exist;
						expect(res.body.users).to.be.an('array');
						done();
					});
			});
			it('should have a pagination object', function(done){
				request(app)
					.get('/users?name=james&email=lawlawl&offset=50')
					.expect(200)
					.end(function(err, res){
						if(err) return done(err);
						expect(res.body.pagination).to.exist;
						expect(res.body.pagination).to.be.an('object');
						expect(res.body.pagination.next).to.match(/james/)
						done();
					});
			});
		});

		describe('the query api', function(){
			it('should accept a name query parameter', function(done){
				request(app).get('/users?name=james').expect(200)
				.end(function(err, res){
					if(err) return done(err);
					expect(res.body.users.length).to.be.at.least(1);
					done();
				});
			});
		});
	});

	describe('POST /users', function(){
		var user;
		beforeEach(function(){
			user = {
				name: "James Perkins",
				email : "james@gmail.com",
				password : "password1234567"
			}
		});
		afterEach(function(done){
			User.findOneAndRemove({ email : "james@gmail.com" }, function(err){
				done();
			});
		})

		it('should respond with a 201', function(done){
			request(app)
				.post('/users')
				.send(user)
				.expect(201)
				.end(function(err, res){
					if(err) return done(err);
					done();			
				});
		});

		describe('sending new user data', function(){
			it('should reject names less than 3', function(done){
				user.name = 'ja';
				request(app)
					.post('/users')
					.send(user)
					.expect(400)
					.end(function(err, res){
						if(err) return done(err);
							done();
					});
			});
		});
	});

	describe.skip('GET /users/:id', function(){
		it('should respond with 200', function(done){
			request(app)
				.get('/users/' + userID)
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					done();
				});
		});
		it('should send a user object back', function(done){
			request(app)
				.get('/users/' + userID)
				.end(function(err, res){
					if(err) return done(err)
					expect(res.body).to.have.property('name')
					done();
				});
		});
	});

	describe.skip('PUT /users/:id', function(){
		beforeEach(function(done){
			User.findByIdAndUpdate(userID, { $set: { email : 'James4@gmail.com' }}, function(err, user){
				if(err) return done(err)
				done();
			});
		})
		it('should respond with 200', function(done){
			request(app)
				.put('/users/' + userID)
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					done();
				});
		});
		it('should update properties', function(done){
			var newEmail = "derper@gmail.com";
			request(app)
				.put('/users/' + userID)
				.expect(200)
				.send({ email : newEmail })
				.end(function(err, res){
					if(err) return done(err);
					//now we hit the get to check if the email was updated
					request(app)
						.get('/users/' + userID)
						.end(function(err, res){
							if(err) return done(err);
							expect(res.body.email).to.equal(newEmail);
							done();
						});
				});
		});
	});

	describe('DELETE /users/:id', function(){
		it('should send a 200 when deleted', function(done){
			//create one then delete it
			request(app)
			.post('/users')
			.expect(201)
			.send({name: "derperx", email: "derpyderpx@gmail.com"})
			.end(function(err, res){
				if(err) return done(err);
				request(app)
				.del('/users/' + res.body._id)
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					done();
				});
			})
		});
	})
});