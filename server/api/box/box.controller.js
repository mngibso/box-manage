/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var request = require('request');
var http = require('http');
var config = require('../../config/environment');

//var _ = require('lodash');
//var Box = require('./box.model.js');

// Get list of things
/*
exports.index = function(req, res) {
  Box.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};
*/
exports.token = function(req,res) {
  //get a new access token
  //Access tokens
  //curl https://api.box.com/oauth2/token -d
  // 'client_id=xxx&
  // client_secret=yyy&grant_type=refresh_token&
  // refresh_token=zzz' -X POST
  //Response:
  /*
  {"access_token":"xxx",
    "expires_in":4126,
    "restricted_to":[
      {
        "scope":"folder_readwrite",
        "object":{
          "type":"folder",
          "id":"nnn",
          "sequence_id":"0",
          "etag":"0",
          "name":"manage-noe-box"
        }
      }
    ],"refresh_token":"yyy",
    "token_type":"bearer"
  }
  */
  //request.post('http://service.com/upload', {form:{key:'value'}})

  request.post('https://api.box.com/oauth2/token', { form:
    {
      grant_type:'refresh_token'
      ,client_id:config.box.clientID
      ,client_secret:config.box.clientSecret
      ,refresh_token:config.box.refreshToken
    }},
    function(error, response, body) {
      var data = null;
      console.log('box.token');
      console.log(error);
      console.log(body);
      if(error) res.send({error:{code:500, message:'Could not load coupon to shopping cart.'}});
      try {
          data = JSON.parse(body);
      } catch(err){
        //Could not parse json
        console.log(err)
        res.send(err);
      }
      res.send({token:data.access_token});
    });
}
// Get a single thing
exports.show = function(req, res) {
  Box.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Box.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Box.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Box.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
