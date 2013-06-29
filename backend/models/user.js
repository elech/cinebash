var mongoose = require('mongoose'),
  validator = require('../util/validator.js');
var UserSchema = new mongoose.Schema({
  name : { type : String },
  email : { type : String, required : true, unique :true }
});

UserSchema.pre('save', function(next){
  if(!validator.validateEmail(this.email)){
    next(new Error('email'));
  }
  if(this.name.length < 3){
    next(new Error('name'));
  }
  next();  
});

module.exports = UserSchema;
mongoose.model('User', UserSchema);