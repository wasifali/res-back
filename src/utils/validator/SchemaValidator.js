var validator = require('is-my-json-valid');
var formConverter = require('./formConverter');

function SchemaValidator (schema) {
	return function SchemaValidator (req, res, next) {

    var validate = validator(schema, {verbose: true, greedy: true})

    validate(req.body);
    
    var errors = validate.errors;

    if(errors) {
      
      // Converting form fields i.e. integers come across as strings
      if (!req.is('json')) {
  	    errors = formConverter(errors, schema, req.body);
  	  }
      if(errors.length > 0) {
          errors.constructor !== Array ? webUrls = [webUrls] : null;
          var errorMessage = errors[0].field.split('.');
          errors[0].message = errorMessage[1] + ' must be valid';
           res.send(400,errors[0]) ;


      } else {
        next();
      }      
      
    } else {
      next();
    }
  }
}

exports = module.exports = SchemaValidator;

