var cluster = require('cluster');
var Server = require('./restaurantServer');
var nconf = require('nconf');
var fs = require("fs");

var config = nconf.argv().env();
var configFile = config.get('config');

if (configFile) {
  if (!fs.existsSync(configFile)) {
    console.error("Config file does not exist at '%s'", configFile);
    process.exit(0);
  } else {
    config.file({file: configFile});
  }
}

config.defaults(require('./config.json'));
//console.log('Configuration: ', {
//  ports: config.get('server:ports'),
//  logging: {
//    console: config.get('logging:transports:console:enabled'),
//    filesystem: config.get('logging:transports:file:enabled')
//  }
//});
//
var numWorkers = config.get('server:workers') || 1;
if(numWorkers>1){
    if (cluster.isMaster) {
      for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
      }
      cluster.on('exit', function (worker, code, signal) {
        //console.log('Cluster worker %d died (%s). restarting...', worker.process.pid, signal || code);
        cluster.fork();
      });
    } else {
      var server = new Server(config);
      server.start.apply(server);
    }
}else {
    var server = new Server(config);
    server.start.apply(server);
}
