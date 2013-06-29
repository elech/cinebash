var expect = window.chai.expect;
describe('service', function() {
  var Song, $httpBackend;
  beforeEach(module('myApp.services'));
  beforeEach(inject(function($injector, youTubeSong){
  	Song = youTubeSong;
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when().respond(200);
  }));
  describe('youTubeSong', function(){
    it('should be an object', function(){
      expect(Song).to.be.an('object');
    })
    it('should have update youtube data', function(done){
      var song = Object.create(Song);
      expect(song).to.have.property('getYTData');
      expect(song.getYTData).to.be.a('function');
      song.id = "BYDKK95cpfM";
      var objResponse = {
        entry: {
          title: {
            $t: "brolo"
          },
          media$group:{
            yt$videoid:{
              $t: "BYDKK95cpfM"
            },
            media$description: {
                $t: "Music video by Drake performing The Motto (Explicit). (C) 2011 Cash Money Records Inc",
                type: "plain"
            }
          }
        }
      };
      var ytSongResponse = objResponse;
      $httpBackend.expectGET(/youtube/).respond(200, ytSongResponse);     
      song.getYTData().success(function(data, status, headers){
        song.parseYTData(data);
        expect(song.title).to.exist;
        expect(song.description).to.exist;
        expect(song.id).to.exist;
        expect(song.id).to.equal("BYDKK95cpfM");
        done();
      });
      $httpBackend.flush();
    })
  })
});
