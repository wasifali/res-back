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


    var User = app.models.User;
    var UserProfile = app.models.UserProfile;
    var Photographer = app.models.Photographer;
    var WebHook = app.models.WebHook;
    var Photoshoots = app.models.Photoshoots;
    var PhotoShootsRequest = app.models.PhotoShootRequest;
    var BookedPackages = app.models.BookedPackages;
    var BookedPackagesPhotoShoot = app.models.BookedPackagesPhotoShoot;
    var PhotoShootsReview = app.models.Reviews;
    var Order = app.models.Order;
    var PhotographerReview = app.models.PhotographerReview;

    var Controller = {
        name: User.modelName
    };


    var generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };
    var validPassword = function(password, storedPassword) {
        return bcrypt.compareSync(password, storedPassword);
    };

    Controller.createUser = function(req, res, next){
        console.log('here')
        User.create(req.body, function (err, user) {
            if (err) {
                app.responder.send(400, res, 'Bad request', 'failed to create user');
            }
            else{
                app.responder.send(200, res, 'Success', 'User creatde!');
            }
        });
    };

    Controller.getUser = function(req, res, next){
        console.log('here');
        User.find({}, function (err, user) {
            if (err) {
                console.log(err);
                res.status(400).send(err, 'Bad request', 'failed to create user')
            }
            else{
                console.log(user);
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.status(200).send(user, 'Success', 'User creatde!');
            }
        });
    };
    return Controller;

};
