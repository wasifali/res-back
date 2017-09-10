/**
 * Created by NovatoreSolutions-mac2 on 07/03/16.
 */


var express = require("express");
var mongoose = require("mongoose");
var bcrypt     = require('bcrypt-nodejs');
var models = require("./src/models");

var app = express();

mongoose.connect("mongodb://snappyClicks:123qwe123@ds153835.mlab.com:53835/snappyclicks", function(err) {
    if (err) {
        console.log(err);
        return process.exit(0);
    }
});

models(app);
