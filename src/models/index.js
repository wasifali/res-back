var fs                = require('fs');
var path              = require('path');
module.exports = function(app) {
    app.models = app.models || {};
    fs.readdirSync(__dirname).forEach(function(f) {
        if (f !== "index.js" && path.extname(f) === '.js'){
            var model = require(path.join(__dirname,f))(app);
            if (model && model.modelName && model.modelName.length && !(model.modelName in app.models)) {
                app.models[model.modelName] = model;
            }
        }
    });
};
