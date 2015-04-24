/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var box = require('./box.model.js');
var EventEmitter = require('events').EventEmitter;
//ToDo - make this a singleton


//Singleton emitter
var Emitter = (function () {
  var emitter;

  function createInstance() {
    var object =  new EventEmitter();
    return object;
  }

  return {
    getInstance: function () {
      if (!emitter) {
        emitter = createInstance();
        console.log('create emitter');
      }
      console.log('return emitter');
      return emitter;
    }
  };
})();

exports.Emitter = Emitter;

exports.register = function(socket) {

  console.log('Register Box Emitter');
  var emitter = Emitter.getInstance();
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
