var fs = require('fs');
var path = require('path');
var winston = require('winston');
var nconf = require('nconf'); 
var config = nconf.argv().env();
var moment = require('moment');

module.exports = function (options) {
  var logLevels = {
    levels: {
      error: 0,
      debug: 1,
      info: 2,

    },
    colors: {
      error: 'red',
      debug: 'yellow',
      info: 'green'

    }
  };

  winston.addColors(logLevels.colors);
  
  var logger = new (winston.Logger)({levels: logLevels.levels});

  if(options&&options.transports.file.enabled) {
  	logger.add(winston.transports.File, {name: 'info', 	colorize: true, level: 'info', 	filename: options.transports.file.server.info});
  	logger.add(winston.transports.File, {name: 'error', colorize: true, level: 'error', filename: options.transports.file.server.error, handleExceptions: true});
    logger.add(winston.transports.File, {name: 'debug', colorize: true, level: 'debug', filename: options.transports.file.server.debug});
  }
  
  if(options&&options.transports.console.enabled) {
  	if (config.get('debug')) {
  	  logger.add(winston.transports.Console, { colorize: true, level: 'debug', timestamp: moment().utc().format('YYYYMMDD-h:mmA'), handleExceptions: true});
  	} else {
  	  logger.add(winston.transports.Console, { colorize: true, level: options.transports.console.level, timestamp: moment().utc().format('YYYYMMDD-h:mmA')});
  	}		
  }
  return logger;
};
