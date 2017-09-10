var traverse = require('traverse');

function formConverter (errors, schema, data) {
  var result = [];
  errors.forEach(function (err) {
    if (err.message == "is the wrong type") {
      
      var propertyPath = err.field.split('data.')[1];
      var property = getSchemaProperty(schema, propertyPath);
      
      if (property.type) {
        
        try {
          var path = propertyPath.split('.');
          var obj = traverse(data)
          if (obj.has(path)) {
            var value = convertType(obj.get(path), property.type);
            obj.set(path, value);
          }
        } catch (ex) {
          result.push(err);
        }
      } else {
        result.push(err);
      }
    } else {
      result.push(err);
    }
  });
  return result;
}

module.exports = formConverter;

function convertType (value, type) {
  switch (type) {
    case "boolean":
      if (value == "0") {
        result = false;
      } else if (value == "1") {
        result = true;
      } else {
        result = JSON.parse(value);
      }
      break;
    case "integer":
    case "number":
      result = JSON.parse(value);
      break;
    default:
  }
  
  return result;
}

function getSchemaProperty (obj, path) {
  if (!path) {
    throw new TypeError("path is required");
  }
  
  function index (obj, i) {
    return (obj.hasOwnProperty("properties") && obj.properties[i]) ? obj.properties[i] : obj[i];
  }
  
  return path.split('.').reduce(index, obj);
}