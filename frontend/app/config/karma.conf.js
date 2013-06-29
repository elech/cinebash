basePath = '../';

files = [
  MOCHA,
  MOCHA_ADAPTER,
  'app/lib/angular/angular.js',
  'app/lib/angular/angular-*.js',
  'angular-1.1.5/angular-mocks.js',
  //'test/lib/angular/angular-mocks.js',
  'components/chai/chai.js',
  'app/js/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['PhantomJS'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
