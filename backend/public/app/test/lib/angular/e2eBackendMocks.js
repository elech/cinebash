'use strict';

angular.module('myAppTest', ['myApp', 'ngMockE2E'])
.run(function($httpBackend) {
	console.log('myAppTest running');
	//var channelsListResponse = { channels : [{name : 'lawl', password : null }, {name : 'PoppinBottles', password : "bottles"}, {name : 'anotherCHannelName', password : null }]};
	//INTERCEPTS FUCKING EVERYTHING MAN BE CAREFUL
	
	//$httpBackend.whenGET(/channels\?.*/).passThrough();//.respond(channelsListResponse);
	$httpBackend.whenGET().passThrough();
	$httpBackend.whenJSONP().passThrough();
});