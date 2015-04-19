/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var box = require('./box.model.js');

exports.register = function(socket) {
  box.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  box.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('box:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('box:remove', doc);
}
