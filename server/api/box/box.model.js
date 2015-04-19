'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
    //owner: {'type': mongoose.Schema.Types.ObjectId, 'ref': 'BusinessEntity'},    //who is the business that owns the video/product
    //updatedBy: {'type': mongoose.Schema.Types.ObjectId, 'ref': 'BusinessEntity'}    //who is the business that owns the video/product
  }
});
BoxTokenSchema.pre('save', function (next, req, callback) {
  //handle the audit object
  if (!this.audit) this.audit = {};
  this.audit.updatedOn = new Date();
  //if(!this.audit.owner) this.audit.owner = req.user._id;
  next (callback);
});

module.exports = mongoose.model('Box', BoxSchema);
module.exports = mongoose.model('BoxToken', BoxTokenSchema);
