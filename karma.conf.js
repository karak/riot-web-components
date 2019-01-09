const webpackConfig = require('./webpack.test.config');
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['test/**/*-test.js'],
    browsers: ['ChromeHeadless'],
    preprocessors: {
      'src/*.js': ['webpack'],
      'test/*.js': ['webpack']
    },
    webpack: webpackConfig,
    logLevel: config.LOG_DEBUG
  });
};
