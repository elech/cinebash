var expect = require('chai').expect,
	mongoose = require('mongoose');
	require('../../../models/user.js');
var User = mongoose.model('User'),
	validator = require('../../../util/validator.js');

	

describe('User Model Test', function(){
	var user;
	beforeEach(function(done){
		user = new User({
			name : 'James Perkins',
			email : 'emasafil@email.com'
		});
		done();		
	});
	afterEach(function(done){
		mongoose.models = {};
		mongoose.modelSchemas = {};
		done();
	});

	describe('validations', function(){
		it('should validate email', function(){
			var badEmails = [
				'aol.com',
			 	'.james@gmail.com',
			 	'shergo.@aol.com'
			 ];
			 var goodEmails = [
			 	'james@gmail.com',
			 	'reddit@aol.com'
			 ];
			 expect(validator.validateEmail(badEmails[0])).to.be.false;
			 expect(validator.validateEmail(badEmails[1])).to.be.false;
			 expect(validator.validateEmail(badEmails[2])).to.be.false;
			 expect(validator.validateEmail(goodEmails[0])).to.be.true;
			 expect(validator.validateEmail(goodEmails[1])).to.be.true;
		});
		it('should validate password', function(){
			expect(validator.validatePassword("0123456")).to.be.false;
			expect(validator.validatePassword("0123456780")).to.be.true;
		});
	});
});