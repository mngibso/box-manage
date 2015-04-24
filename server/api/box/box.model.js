'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongo = require('../../components/database'),
    mongoBox = mongo.mongoBox;

var BoxSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});
var BoxTokenSchema = new Schema({
  access: String,
  refresh: String,
  audit: {    //audit trail
    addedOn: {'type': Date, 'default': Date.now},
    updatedOn: {'type': Date, 'default': Date.now}
  }
});
BoxTokenSchema.pre('save', function (next, req, callback) {
  //handle the audit object
  if (!this.audit) this.audit = {};
  this.audit.updatedOn = new Date();
  //if(!this.audit.owner) this.audit.owner = req.user._id;
  next (callback);
});

exports.BoxToken = mongoBox.model('BoxToken', BoxTokenSchema);

