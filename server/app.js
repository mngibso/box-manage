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
function clientErrorHandler(err, req, res, next) {
  console.log('clientErrorHandler');
  if (req.xhr) {
    res.status(500).send({ error: 'Something blew up!' });
  } else {
    next(err);
  }
}
function errorHandler(err, req, res, next) {
  console.log('errorHandler');
  res.status(500);
  res.send('Error')
  //ToDo - error template
  //res.render('error', { error: err });
}

var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);
app.use(clientErrorHandler);
app.use(errorHandler);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});




//Proxy

var http = require('http');

http.createServer(onRequest).listen(8000);

function onRequest(client_req, client_res) {
  console.log('serve: ' + client_req.method + ':' + client_req.url);

  var options = {
    hostname: 'api.box.com',
    port: 80,
    //port: 443,
    path: client_req.url,
    method: 'GET'
  };

  client_res.setHeader('Access-Control-Allow-Origin', '*');
  //client_res.setHeader('Access-Control-Allow-Origin', client_req.headers.origin || '*');
  client_res.setHeader('Access-Control-Allow-Credentials', true);
  client_res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');  // only allow cross domain for read only operations
  client_res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Location, Content-Type, Authorization, Content-Length, X-Requested-With');

  var proxy = http.request(options, function (res) {
    console.log('xxx');
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}

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

 Using the Access and Refresh TokensThe access_token is the actual string needed to make API requests.
 Each access_token is valid for 1 hour. In order to get a new, valid token, you can use the accompanying refresh_token.
 Each refresh_token is valid for one use in 60 days.
 Every time you get a new access_token by using a refresh_token,
 we reset your timer for the 60 day period and hand you a new refresh_token.
 This means that as long as your users use your application once every 60 days, their login is valid forever.
 To use the refresh_token to get a new access_token, make a POST request to
 https://app.box.com/api/oauth2/token with the following, URL encoded parameters:A sample cURL request would look like:
 */

// Expose app
exports = module.exports = app;
