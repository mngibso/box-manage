/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

require('./box.model');
//var request = require('request');
var jq = require('jquery');
jq.support.cors = true;
var http = require('http');
var BoxToken = require('mongoose').model('BoxToken');
var config = require('../../config/environment');
//var refreshToken = exports.token;

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
var refreshToken = function(success, fail) {
  BoxToken.findOne(function (err, token) {
    if (err) {
      return fail(err);
    }
    //return res.json(200, things);

    console.log('refresh token = ' + token.refresh);
    console.log('access token = ' + token.access);

    var form = {
      grant_type: 'refresh_token'
      , client_id: config.box.clientID
      , client_secret: config.box.clientSecret
      , refresh_token: token.refresh
    };

    jq.post('https://api.box.com/oauth2/token', form)
      .done( function( data, textStatus, jqXHR ) {
        console.log('box.token');
        console.log(data);
        //Update BoxToken
        BoxToken.findOneAndUpdate({},
          {
            refresh: data.refresh_token,
            access: data.access_token
          },
          function (err, token) {
            if(err) return fail(err);
            success({token: data.access_token});
          });
      })
      .fail( function( jqXHR, textStatus, errorThrown ){
        console.log('box.token error');
        console.log(textStatus);
        console.log(errorThrown);
        fail(errorThrown);
      });

  });

};

exports.token = function(req, res, next){
  refreshToken(res.send, next);
};

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


// Get a single thing

//curl https://api.box.com/2.0/folders/FOLDER_ID/items?limit=2&offset=0  -H "Authorization: Bearer ACCESS_TOKEN"
//ToDo - add limit and offset for pagination
exports.contents = function(req, res, next) {
  console.log('call contents');
  var folder_id = req.params.folder_id;
  var url = 'https://api.box.com/2.0/folders/' + folder_id + '/items';
  var token = 'vx89UjljqT1a2NiDLhz5aiu9PubUMAh2';
  // request.post('https://api.box.com/oauth2/token',
  //var url = 'http://localhost:8000' + '/folders/' + folder_id + '/items';
  console.log(url);
  var conf = {
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token);}
  };
  console.log(conf);
  jq.ajax(url, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
    .done ( function (data, textStatus, jqXHR) {
    console.log('contents ' + data);
      res.send(data);
  })
    .fail( function( jqXHR, textStatus, errorThrown ){
      console.log(errorThrown);
      console.log(jqXHR.status);
      console.log(jqXHR.getAllResponseHeaders()['www-authenticate']);
      next(errorThrown);


    });
};
exports.showme = function(req, res, next) {
  Box.findById(req.params.id, function (err, thing) {
    if(err) { return next(err); }
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

//Retry ajax requests exactly ONCE
jq.ajaxPrefilter(function(opts, originalOpts, jqXHR) {
  // you could pass this option in on a "retry" so that it doesn't
  // get all recursive on you.
  if (opts.refreshRequest) {
    return;
  }

  // our own deferred object to handle done/fail callbacks
  var dfd = jq.Deferred();

  // if the request works, return normally
  jqXHR.done(dfd.resolve);

  // if the request fails, do something else
  // yet still resolve
  jqXHR.fail(function() {
    var args = Array.prototype.slice.call(arguments);
    // If box api && 401, refresh access token and retry
    var url = this.url;
    if (jqXHR.status == 401 && this.url.indexOf(config.box.base_ur) == -1) {
      console.log('RETRY box api call');
      //refreshToken and retry
      refreshToken( function( data ){ //success
          //Got new token, use it in retry
          var newOpts = jq.extend({}, originalOpts, {
            refreshRequest: true
              ,headers: {
                'Authorization': 'Bearer ' + data.token
              }
          });
          //retry
          console.log('retrying api call');
          console.log(originalOpts);
          console.log(newOpts);
          jq.ajax(url, newOpts).then(dfd.resolve, dfd.reject);
        },
        function(){ //fail
          //normal fail
          dfd.rejectWith(jqXHR, args);
        });
    } else {
      //normal fail
      dfd.rejectWith(jqXHR, args);
    }
  });

  // NOW override the jqXHR's promise functions with our deferred
  return dfd.promise(jqXHR);
});
