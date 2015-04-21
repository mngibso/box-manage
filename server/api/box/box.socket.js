/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var box = require('./box.model.js');
var Emitter = require('events').EventEmitter;
var emitter = exports.emitter =  new Emitter();

exports.register = function(socket) {
  //box.schema.post('save', function (doc) {
  emitter.on( 'boxCreate', function( doc ) {
    onSave(socket, doc);
  });
  emitter.on('boxRemove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('box:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('box:remove', doc);
}
