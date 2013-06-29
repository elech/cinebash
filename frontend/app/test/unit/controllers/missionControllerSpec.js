'use strict';

/* jasmine specs for controllers go here */
var expect = window.chai.expect;
describe('controllers', function(){
  var $rootScope, $httpBackend, scope, $controller;
  beforeEach(module('myApp.controllers'));

  //beforeEach(inject(function($injector, $rootScope){
  	//$httpBackend = $injector.get('$httpBackend');
  	//$controller = $injector.get('$controller');
    //$httpBackend.when('GET', new RegExp(".*channels.*")).respond({ channels : [{name : 'lawl', password : null }, {name : 'Poppin Bottles', password : "bottles"}]});
  	//scope = $rootScope.$new();
  //}));
 
/*  afterEach(function(){
  	$httpBackend.verifyNoOutstandingExpectation();
  	$httpBackend.verifyNoOutstandingRequest();
  	scope = null;
  });*/
  //it('should  ');


/*  it('should have a search function', function(){
    $controller('HomeController', {$scope : scope });
    expect(scope.searchChannels).to.exist;
  });*/
  // it('should call /channels and populate channels array', function(){
  //   $controller('HomeController', {$scope : scope});
  //   $httpBackend.expectGET(/channels\?name\=.*/);
  //   scope.searchChannels();
  //   $httpBackend.flush();
  //   expect(scope.channels).to.exist;
  //   expect(scope.channels).to.have.property('channels');
  //   expect(scope.channels.channels.length).to.be.above(1);
  // });

/*  it('should ....',inject(function($controller){
  	$controller('MobileHomeController', {$scope : scope});
  	expect(scope).to.exist;
  	$httpBackend.expectGET('/users');
  	$httpBackend.flush();
  	expect(scope.user).to.exist;
  }));

  it('should ....', inject(function($controller) {
  	$controller('HomeController', {$scope : scope});
  	expect(scope.data).to.be.an('array');
  }));

  it('should go hard', function(done){
  	expect(true).to.be.true;
  	done();
  });*/
});
