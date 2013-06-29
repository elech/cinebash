'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {
  beforeEach(function() {
    browser().navigateTo('../../app/index-e2e.html');
  });

  it('should redirect to /', function(){
    expect(browser().location().url()).toBe("/");
  });

  describe('home', function(){
    beforeEach(function(){
      browser().navigateTo('#/');
    });

    it('should render home.html when at home', function(){
      expect(element('#joinAChannelContainer h2').text()).toMatch('Join a channel');
      
    });

    it('should have an input box', function(){
      expect(element('#query').val()).toEqual("");
    });
    it('should query list of channels', function(){
      input('q').enter("lawl".trim());
      element('#joinAChannelContainer #search').click();
      expect(repeater('#joinAChannelContainer ul li').count()).toBeGreaterThan(1);
      var currentCount = repeater('#joinAChannelContainer ul li').count();
      var channelName;
      element('#joinAChannelContainer ul').query(function(ul, done){
        channelName = ul.find('li:first').text().trim();
        ul.find('li:first').click();
        expect(repeater('#joinAChannelContainer ul li').count()).toBeLessThan(3);
        expect(browser().location().path()).toBe("/channels/" + channelName);
        done();
      });
      //
    });

    it('should redirect to channels page on click', function(){
      browser().navigateTo('#/channels/lawl');
      expect(element('.span2').text()).toMatch(/side/);
    });
  });
/*  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/view1");
  });


  describe('view1', function() {

    beforeEach(function() {
      browser().navigateTo('#/view1');
    });


    it('should render view1 when user navigates to /view1', function() {
      expect(element('[ng-view] p:first').text()).
        toMatch(/partial for view 1/);
    });
  });


  describe('view2', function() {

    beforeEach(function() {
      browser().navigateTo('#/view2');
    });


    it('should render view2 when user navigates to /view2', function() {
      expect(element('[ng-view] p:first').text()).
        toMatch(/partial for view 2/);
    });

  });*/
});