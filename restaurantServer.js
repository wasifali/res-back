var express = require("express");
var express = require("express");
var fs = require("fs");
var mongoose = require("mongoose");
var nconf = require("nconf");
var path = require("path");
var util = require("util");
var controllers = require("./src/controllers");
var mailer = require("./src/utils/mailer");
var models = require("./src/models");
var responder = require("./src/utils/responder");
var routes = require("./src/routes");
var i18n = require("i18n");
var http = require('http');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var session = require('express-session');
var csurf = require('csurf');

var Server = function Server (config) {
    var app, db;
    if (config.get("newrelic")) {
      this.setupNewRelic(config);
    }
    //
    var app = module.exports = express();
    app.config = config;
    db = app.db = mongoose.connect(app.config.get("db:users"), function(err) {
      if (err) {
        console.log(err);
        return process.exit(0);
      }
    });
    //app.events = new EventEmitter();

    app.getDB = function(schemaName) {
      return db;
    };

    this.setupLogging(app);

    // Middleware
    app.auditlogger = require("./src/utils/auditlogger")(app);

    app.use( app.auditlogger);
    app.use(morgan('combined'));


    i18n.configure({
      locales: ["en"],
      directory: path.join(__dirname, "locales"),
      updateFiles: false
    });



    // get all data/stuff of the body (POST) parameters\
    // server congfiguration

    app.use(bodyParser.json()); // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    app.use(cookieParser()); // read cookies (needed for auth)


    //ok
// required for passport
    app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
        resave: true,
        saveUninitialized: true
    })); // session secret

    //app.use(passport.initialize());
    //app.use(passport.session()); // persistent login sessions


    app.use(methodOverride('X-HTTP-Method-Override'));

    app.i18n = i18n;
    app.use(i18n.init);
    app.use(express.static(__dirname + '/public'));
    app.responder = responder(app);

    process.on('uncaughtException', function(err) {
        console.log('Caught exception: ' + err.stack);
        process.exit();
    });

    // security
    // setup route middlewares
    //app.use(csurf());


    // Routes
    models(app);
    //require('./config/passport')(app, passport);
    controllers(app);

    //app.authenticator = require("./src/utils/authenticator")(app);
    app.all(app.config.get('server:routePrefix')+ '*');


    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next();
    });







    routes(app);
    app.get('*', function(req, res) {
      res.sendFile(__dirname + '/public/index.html');
    });
    this.app = app;
    return this;
};

Server.prototype.setupNewRelic = function (config) {
  if(config && config.get("newrelic:app_name") && config.get("newrelic:license_key")) {
    process.env["NEW_RELIC_APP_NAME"] = config.get("newrelic:app_name");
    process.env["NEW_RELIC_LICENSE_KEY"] = config.get("newrelic:license_key");
    process.env["NEW_RELIC_NO_CONFIG_FILE"] = 1;

    if (config.get("newrelic:logging")) {
      if (config.get("newrelic:logging:log")) {
        process.env["NEW_RELIC_LOG"] = config.get("newrelic:logging:log");
      }
      if (config.get("newrelic:logging:level")) {
        process.env["NEW_RELIC_LOG_LEVEL"] = config.get("newrelic:logging:level");
      }
    }
    require("newrelic");
  }
};

Server.prototype.setupLogging = function (app) {
  return app.log = require("./src/utils/logger")(app.config.get("logging"));
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

Server.prototype.start = function () {
  var _this = this;
      //console.log("Running env=%s", this.app.get("env"));
        require('http').createServer(this.app).listen(process.env.PORT || this.app.config.get("server:ports:public"), function() {
	    console.log("http server (public) worker started, sharing port " + _this.app.config.get("server:ports:public"));
	});
};

// ok
// local DB

//        "users": "mongodb://localhost:27017/snappy?ssl=false",
//        "taskqueue": "mongodb://localhost:27017/taskqueue?ssl=false"
module.exports = Server;
