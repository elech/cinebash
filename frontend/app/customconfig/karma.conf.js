// Karma configuration
// Generated on Mon Jun 10 2013 09:27:52 GMT-0500 (CDT)


// base path, that will be used to resolve files and exclude
basePath = '../';


// list of files / patterns to load in the browser
files = [
  MOCHA,
  MOCHA_ADAPTER,
  'app/lib/angular/angular.js',
  'test/lib/angular/angular-*.js',
  
  'app/js/**.js',
  
  'test/e2e/**.js',
  'test/unit/**.js'
];
/*

  'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js',
  'test/unit/controllersSpec.js'
*/

// list of files to exclude
exclude = [
  'test/e2e/runner.html'
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
