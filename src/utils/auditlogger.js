var winston = require('winston');
var morgan = require('morgan');
module.exports = function auditLogger (app) {
  var options = app.config.get("logging") || {}
  var format = app.config.get('logging:audit:format') || ':remote-addr ":req[token]" ":method :url HTTP/:http-version" :status :res[content-length] :response-time ":referrer" ":user-agent"';

  var logger;
  if (options.logFile) {
    logger = new (winston.Logger)({
      transports: [new winston.transports.File({name: 'user-data-api-audit', colorize: true, level: 'info',
        filename: options.logPath + '/user-data-api-audit.log', timestamp: true})]
    });
  }

  var stream = {
    write: function (message, encoding) {
      if (logger) {
        logger.info(message);
      }
    }
  };

  return morgan('combined', {format: format, stream: stream});
}