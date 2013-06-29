var request = require('supertest'),
	app = require('../../app.js'),
	expect = require('chai').expect,
	mongoose = require('mongoose');



/*
	Unit testing the REST API Endpoints
	We're using supertest, its made by the same guys that make express its cool
	https://github.com/visionmedia/supertest
*/

//Basically, describe what "area/use cases" your testing
//then drill down into a more specific test, where it comes into play
//then run a test inside that block
/*
describe('GET /users', function(){
	after(function(){
		mongoose.models = {};
 		mongoose.modelSchemas = {};
	});
	it('should give a 200 response', function(done){
		request(app)
			.get('/users')
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);
				done();
			});
	});

	describe('The json response', function(){
		it('should give a json response', function(done){
			request(app)
				.get('/users')
				.end(function(err, res){
					if(err) return done(err);
					expect(res.body).to.be.an('object');
					done();
				});
		});

		it('should have a users array', function(done){
		request(app)
			.get('/users')
			.end(function(err, res){
				if(err) return done(err);
				expect(res.body.users).to.be.an('array');
				done();
			});
		});
	});
});

describe('POST /users', function(){
	it('should validate username', function(done){
		request(app)
		.post('/users')
		.expect(400)
		.end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("should validate a password", function(done){
		request(app)
			.post("/users")
			.send({"userName" : "James"})
			.expect(400)
			.end(function(err, res){
				if(err) return done(err);
				done();
			});
	});

	it("should validate a password length", function(done){
		request(app)
			.post("/users")
			.send({"userName" : "James", "password" : "derp"})
			.expect(400)
			.end(function(err, res){
				if(err) return done(err);
				done();
			});
	});

	it("should validate a password length", function(done){
		request(app)
			.post("/users")
			.send({"userName" : "James", "password" : "derp"})
			.expect(400)
			.end(function(err, res){
				if(err) return done(err);
				done();
			});
	});

	it("should validate email existing", function(done){
		request(app)
			.post("/users")
			.send({"userName" : "James", "password" : "derp", "email" : "derp@gmail.com"})
			.expect(400)
			.end(function(err, res){
				if(err) return done(err);
				done();
			});
	});

});
*/