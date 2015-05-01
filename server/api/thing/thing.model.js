'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  audit: {    //audit trail
    addedOn: {'type': Date, 'default': Date.now},
    updatedOn: {'type': Date, 'default': Date.now}
  }
});
ThingSchema.pre('save', function (next, req, callback) {
  //handle the audit object
  if (!this.audit) this.audit = {};
  this.audit.updatedOn = new Date();
  //if(!this.audit.owner) this.audit.owner = req.user._id;
  next (callback);
});

module.exports = mongoose.model('Thing', ThingSchema);
