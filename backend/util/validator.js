var validateEmail = function(email){
	var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}
var validatePassword = function(password){
	if(password.length < 8){
		return false;
	}
	return true;
}

exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;