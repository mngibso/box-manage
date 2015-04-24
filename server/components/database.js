var mongoose = require('mongoose');
var config = require('../config/environment');

// Connect to database - default
mongoose.connect(config.mongo.uri, config.mongo.options, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + config.mongo.uri + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + config.mongo.uri);
  }
});

//This database holds the Box api tokens
exports.mongoBox = mongoose.createConnection(config.mongobox.uri, config.mongobox.options, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + config.mongobox.uri + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + config.mongobox.uri);
  }
});
