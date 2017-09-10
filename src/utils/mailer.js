var _ = require('underscore');
var nodemailer = require('nodemailer');


module.exports = function (options, log) {
  var emailTemplates = require('email-templates');
  options = options || {};
  var i18n = options.i18n;
  var log = options.log;
  var templatePath = options.templatePath;

  var transport = nodemailer.createTransport("SMTP", {
    service:    "AWS",
    auth: {
      //user: options.server.username,
      //pass: options.server.password
    }
  });

  var sendMail = function(params, callback) {
    var sender = params.senderName !== undefined ? (params.senderName + " <" + params.sender + ">") : ("<" + params.sender + ">");
    
    var recipients = _.map(params.recipients, function(recipient) {
      if (typeof(recipient) == 'object') {
        return recipient.name + " <" + recipient.email + ">";
      } else {
        return recipient;
      }
    });
    
    var mailOptions = {
      from:     sender,
      to:       recipients,
      subject:  params.subject
    };
    
    if(params.isTextOnly) {
      mailOptions.text = params.emailText;
      transport.sendMail(mailOptions, function(error, response){
        if(error){
          log.error(error);
        } else {
          log.info("Message sent " + response.message);
        }
        if(typeof(callback) == 'function') {
          callback(error, response);
        }
      });
      
    } else {
      emailTemplates(templatePath, function(err, template) {
        if(err) {
          log.error(err);
          if(typeof(callback) == 'function') {
            callback(err);
          }
        } else {
          template(params.templateId, params.templateData, function(err, html, text) {
            if(err) {
              log.error(err);
              if(typeof(callback) == 'function') {
                callback(err);
              }              
            } else {
              mailOptions.html = html;
              mailOptions.text = text;
              transport.sendMail(mailOptions, function(error, response){
                if(error){
                  log.error(error);
                } else {
                  log.info("Message sent " + response.message);
                }
                if(typeof(callback) == 'function') {
                  callback(error, response);
                }
              });
            }
          });
        }
      });
    }
  };

  return {
    sendMail: sendMail
  };
};
