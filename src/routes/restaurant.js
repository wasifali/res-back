var validate = require('../utils/validator/SchemaValidator');
var createSchema = require('../schemas/user-create');
var updateSchema = require('../schemas/user-update');
var createProfile = require('../schemas/userProfile');



module.exports = function (app) {
    var UserController = app.controllers.User;
    var RestaurantController = app.controllers.Restaurant;
    var baseUrl = app.config.get('server:routePrefix');

    app.post(baseUrl + '/restaurant/create', RestaurantController.createRestaurant);
    app.get(baseUrl + '/restaurant/list', RestaurantController.getRestaurants);
    app.post(baseUrl + '/restaurant/update', RestaurantController.updateRestaurants);
    app.post(baseUrl + '/restaurant/delete', RestaurantController.deleteRestaurants);
};
