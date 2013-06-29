var expect = window.chai.expect;
describe('service', function() {
  var ytp, $httpBackend;
  beforeEach(module('myApp.services'));
  beforeEach(inject(function(youTubePlayer){
  	ytp = youTubePlayer;
  }));
  describe('youTubePlayer', function(){
    it('should have a load scripts function', function(){
      expect(ytp.loadScripts).to.exist;
      expect(ytp.loadScripts).to.be.a('function');
    })
  })
})