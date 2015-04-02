/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + config.mongo.uri + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + config.mongo.uri);
  }
});

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

//Box sdk
/*
 curl https://api.box.com/t-Type:application/x-www-form-urlencoded" -d 'client_id=xxx&client_secret=xxx&grant_type=urn:box:oauth2:grant-type:provision&username=mark@gibsonsoftware.com' -X POST
 {"access_token":"xxx","expires_in":4004,"restricted_to":[{"scope":"folder_readwrite","object":{"type":"folder","id":"3376092556","sequence_id":"0","etag":"0","name":"manage-noe-box"}}],"refresh_token":"xxx","token_type":"bearer"}
 */
/*
{"access_token":"RD5GHAagD2DuvwIrb9B9DtawD6EeqWhr"
  ,"expires_in":4004
  ,"restricted_to":[
  {"scope":"folder_readwrite",
    "object":{
      "type":"folder",
      "id":"3376092556","sequence_id":"0","etag":"0",
      "name":"manage-noe-box"}
  }
],"refresh_token": "Dw3zYO6Bss1LPMek8cwnyLFlnCJfuybAUkBkq9NGionjsvu4oyQZifTY8I8ipAtW",
  "token_type":"bearer"}
  */
/*

 Using the Access and Refresh TokensThe access_token is the actual string needed to make API requests. Each access_token is valid for 1 hour. In order to get a new, valid token, you can use the accompanying refresh_token. Each refresh_token is valid for one use in 60 days. Every time you get a new access_token by using a refresh_token, we reset your timer for the 60 day period and hand you a new refresh_token. This means that as long as your users use your application once every 60 days, their login is valid forever. To use the refresh_token to get a new access_token, make a POST request to https://app.box.com/api/oauth2/token with the following, URL encoded parameters:A sample cURL request would look like:
 https://developers.box.com/oauth/
 */
app.set('BOX_REFRESH_TOKEN', process.env.BOX_REFRESH_TOKEN || 'none')
var box_sdk = require('box-sdk');

var logLevel = 'debug'; //default log level on construction is info

//Default host: localhost
var box = box_sdk.Box({
  client_id: process.env.BOX_CLIENT_ID || 'none',
  client_secret: process.env.BOX_CLIENT_SECRET || 'none',
  port: 9999,
  host: 'localhost' //default localhost
}, logLevel);
var connection = box.getConnection(process.env.box_user_email || 'mark@gibsonsoftware.com');

//Navigate user to the auth URL
console.log(connection.getAuthURL());

connection.ready(function () {
  connection.getFolderItems(0, {limit: 1}, function (err, result) {
    if (err) {
      console.error(JSON.stringify(err.context_info));
    }
    console.dir(result);
  });
});


// Expose app
exports = module.exports = app;
