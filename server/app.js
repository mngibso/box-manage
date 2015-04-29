/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
require('./components/database');

// Setup server
var app = express();
function clientErrorHandler(err, req, res, next) {
  console.log('clientErrorHandler');
  if (req.xhr) {
    if( err.status ) {
      res.status(err.status).send({ error: err.error || err });
    } else {
      res.status(500).send({error: { message: 'Unknown Error'} });
    }
  } else {
    next(err);
  }
}
function errorHandler(err, req, res, next) {
  console.log('errorHandler');
  var message = err.message || 'Unknown Error';
  res.status(err.status || 500);
  res.send(message);
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

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
