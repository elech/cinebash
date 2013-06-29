'use strict';

/* jasmine specs for services go here */
var expect = window.chai.expect;
describe('service', function() {
  var yth,
      $httpBackend;
  beforeEach(module('myApp.services'));
  beforeEach(inject(function($injector, youtubeHandler){
  	yth = youtubeHandler;
  }));
  beforeEach(inject(function($injector){
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', new RegExp(".*youtube.*")).respond('')
  }))
  describe('youtubeHandler', function(){
  	it('should a get songs function',function(){
  		expect(yth.getSongs).to.exist;
  		expect(yth.getSongs).to.be.a("function");
  		expect(yth.getSongs()).to.be.an('array');
  	})
  	it('should be able to set songs', function(){
  		var songs = [{title: '1'}, {title: '2'}];
  		yth.setSongs(songs);
  		expect(yth.getSongs()[0]).to.exist;
  		expect(yth.getSongs()[0]).to.have.property('title');
  	})
  	it('should have a pop', function(){
  		var songs = [{title: '1'}, {title: '2'}],
  			songsLength = songs.length;
  		yth.setSongs(songs);
  		expect(yth.pop).to.exist;
  		expect(yth.pop).to.be.a('function');
  		expect(yth.pop()).to.be.an('object');
  		expect(yth.getSongs().length).to.be.below(songsLength);
  	})
  })
});
