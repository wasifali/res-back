var validate = require('../utils/validator/SchemaValidator');
var createSchema = require('../schemas/user-create');
var updateSchema = require('../schemas/user-update');
var createProfile = require('../schemas/userProfile');



module.exports = function (app) {
    var UserController = app.controllers.User;
    var baseUrl = app.config.get('server:routePrefix');

    console.log(baseUrl)
    app.post(baseUrl + '/user/create', UserController.createUser);
    app.get(baseUrl + '/user/get', UserController.getUser);

};
