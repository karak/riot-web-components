const webpackConfig = require('./webpack.test.config');
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['test/**/*-test.js'],
    browsers: ['ChromeHeadless'],
    preprocessors: {
      'src/*.js': ['webpack', 'sourcemap'],
      'test/*.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    logLevel: config.LOG_DEBUG
  });
};
