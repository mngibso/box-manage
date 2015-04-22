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
  emitter.on('boxDestroy', function (doc) {
    console.log('boxDestroy emmitted ' + doc.id);
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('box:save', doc);
}

function onRemove(socket, doc, cb) {
  console.log('boxDestroy onRemove ' + doc.id);
  socket.emit('box:remove', doc);
}
