module.exports = function(app) {

    var _ =  require('underscore');
    var fs = require('fs');
    var async = require('async');
    var bcrypt = require('bcrypt-nodejs')
    var uuid = require('node-uuid');
    var nodemailer = require('nodemailer');
    var sgTransport = require('nodemailer-sendgrid-transport');
    var jwt = require('jwt-simple');
    var gm = require('gm').subClass({imageMagick: true});

    var PaymentAccount = app.models.PaymentAccount;
    var apiKey = "f286c684aa79f3e6cbdbd70dfbfbb696";


    var path = require('path');


    var Restaurant = app.models.Restaurant;

    var Controller = {
        name: Restaurant.modelName
    };

//Create Restaurant Function
    Controller.createRestaurant = function(req, res, next){
        console.log("In restaurant create !!!!!!")
        Restaurant.create(req.body, function (err, user) {
            console.log(req);
            if (err) {
                res.status(400).send('Bad request');
            }
            else{
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.status(200).send(users);
            }
        });
    };

    //Update Restaurant
    Controller.updateRestaurants = function(req, res, next){
        Restaurant.update({}, function (err, user) {
            if (err) {
                res.status(400).send('Bad request');
            }
            else{
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.status(200).send(users);
            }
        });
    };

    //Getting list of all Restaurants within the range of 20 miles
    Controller.getRestaurants = function(req, res, next){
        Restaurant.find(
            {
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [1, 1]
                        }
                    },
                    "$maxDistance": 20000
                }
            }, function (err, restaurants) {
            if (err) {
                res.status(400).send('Bad request');
            }
            else{
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.status(200).send(restaurants);
            }
        });
    };

    Controller.deleteRestaurants = function(req, res, next){
        Restaurant.delete({}, function (err, user) {
            if (err) {
                res.status(400).send('Bad request');
            }
            else{
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.status(200).send(users);
            }
        });
    };

    return Controller;

};
