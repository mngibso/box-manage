'use strict';

require('./box.model');
var request = require('request');
var jq = require('jquery');
var http = require('http');
var BoxToken = require('mongoose').model('BoxToken');
var boxConfig = require('../../config/environment').box;
var fs = require('fs');
var async = require('async');
//var Emitter = require('events').EventEmitter;
var emitter = require('./box.socket.js').emitter;

jq.support.cors = true;
//Refresh the Box access and refresh tokens
var refreshToken = function(cb, failcb) {
  BoxToken.findOne(function (err, token) {
    if (err) {
      return fail(err);
    }
    var form = {
      grant_type: 'refresh_token'
      ,client_id: boxConfig.clientID
      ,client_secret: boxConfig.clientSecret
      ,refresh_token: token.refresh
    };

    jq.post('https://api.box.com/oauth2/token', form)
      .done( function( data, textStatus, jqXHR ) {
        //Update tokens in the db
        BoxToken.findOneAndUpdate({},
          {
            refresh: data.refresh_token,
            access: data.access_token
          },
          function (err, token) {
            if(err) return failcb(err);
            boxConfig.access_token = data.access_token;
            boxConfig.refresh_token = data.refresh_token;
            cb({token: data.access_token});
          });
      })
      .fail( function( jqXHR, textStatus, errorThrown ){
        console.log('box.token error');
        console.log(textStatus);
        console.log(errorThrown);
        failcb(errorThrown);
      });

  });

};

exports.token = function(req, res, next){
  refreshToken(function(data) { res.send(data); },
    function(err) { next(err); });
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



//curl https://api.box.com/2.0/folders/FOLDER_ID/items?limit=2&offset=0  -H "Authorization: Bearer ACCESS_TOKEN"
//ToDo - add limit and offset for pagination
//Get folder contents
exports.contents = function(req, res, next) {
  var folder_id = req.params.folder_id || boxConfig.appFolderId;
  var url = boxConfig.base_url + '/folders/' + folder_id + '/items';
  jq.ajax(url, {
    headers: {
      Authorization: 'Bearer ' + boxConfig.access_token
    }
  })
    .done ( function (data, textStatus, jqXHR) {
    console.log('called contents');
    console.log(data);
    res.send(data);
  })
    .fail( function( jqXHR, textStatus, errorThrown ){
      console.log(errorThrown);
      console.log(jqXHR.status);
      console.log(jqXHR.getAllResponseHeaders()['www-authenticate']);
      next(errorThrown);


    });
};

//Get file contents
//curl https://api.box.com/2.0/files/29049453912/content
exports.download = function(req, res, next) {
  var file_id = req.params.file_id;
  var url = boxConfig.base_url + '/files/' + file_id + '/content';

  //This call should return a 302 with the location header
  jq.ajax(url, {
    headers: {
      Authorization: 'Bearer ' + boxConfig.access_token
    }
  })
    .done ( function (data, textStatus, jqXHR) {
    //We should never get a 20x from this call
    next({error: 'Unexpected result'});
  })
    .fail( function( jqXHR, textStatus, errorThrown ){
      console.log(errorThrown);
      console.log(jqXHR.status);
      if(jqXHR.status == 302){
        //This is the expected return
        var url = jqXHR.getResponseHeader('location') || '';
        if(url) return res.send({url: url});
      }
      next(errorThrown);
    });
};

/*
 curl https://upload.box.com/api/2.0/files/content \
 -H "Authorization: Bearer ACCESS_TOKEN" -X POST \
 -F attributes='{"name":"tigers.jpeg", "parent":{"id":"11446498"}}' \
 -F file=@myfile.jpg
 */
exports.upload = function(req, res, next) {
  //Try to upload, if 401, refresh token and try again
  async.waterfall([
    function(callback) {
      boxUpload(req, function (response) {
          //Success  - but check for status
          if (response.statusCode == 201) {
            //success
            return callback(null, false, response);
          }
          if (response.statusCode == 401) {
            //Retry
            return callback(null, true, null)
          }
          //non 401 error
          callback({error: response.statusCode});
        }
        //ERROR
        , function (err) {
          callback(err);
        });
      //callback(null, 'one', 'two');
    }
    , function(retry, response, callback) {
      // arg1 now equals 'one' and arg2 now equals 'two'
      if(retry) {
        refreshToken(function(access){
            console.log('new token ' + access.token)
            callback(null, true, null);
          }
          ,function(err){
            callback(null, true, null);
          }
        );
      } else { // Already have data
        callback(null, retry, response);
      }
    },
    function(retry, response, callback) {
      // arg1 now equals 'three'
      if(retry){
        //retry the upload
        boxUpload(req, function (response) {
            //Success  - but check for status
            if (response.statusCode == 201) {
              callback(null, response)
            } else {
              callback({error: response.statusCode});
            }
          }
          , function (err) {
            callback(err);
          });
      } else {
        //already have data
        callback(null, response);
      }
    }
  ], function (err, response) {
    if(err) return next(err);
    console.log('UPLOAD SUCCESS');
    //{"total_count":1,"entries":[{"type":"file","id":"29038747944","file_version":{"type":"file_version","id":"27723630358","sha1":"a28cb3fffbd2d6d21ddfc66ad0eedebcc1fc1fcd"},"sequence_id":"0","etag":"0","sha1":"a28cb3fffbd2d6d21ddfc66ad0eedebcc1fc1fcd","name":"wallet","description":"","size":9831,"path_collection":{"total_count":2,"entries":[{"type":"folder","id":"0","sequence_id":null,"etag":null,"name":"All Files"},{"type":"folder","id":"3405819366","sequence_id":"0","etag":"0","name":"manage-noe-box"}]},"created_at":"2015-04-20T15:06:56-07:00","modified_at":"2015-04-20T15:06:56-07:00","trashed_at":null,"purged_at":null,"content_created_at":"2015-04-20T15:06:56-07:00","content_modified_at":"2015-04-20T15:06:56-07:00","created_by":{"type":"user","id":"232678009","name":"Mark Gibson","login":"mark@gibsonsoftware.com"},"modified_by":{"type":"user","id":"232678009","name":"Mark Gibson","login":"mark@gibsonsoftware.com"},"owned_by":{"type":"user","id":"235645086","name":"Mark Gibson yahoo","login":"mngibso@yahoo.com"},"shared_link":null,"parent":{"type":"folder","id":"3405819366","sequence_id":"0","etag":"0","name":"manage-noe-box"},"item_status":"active"}]}
    try {
      var data = JSON.parse(response.body);
    } catch (err) {
      var data = {error: err};
    }
    console.log(data);
    //var emitter = new Emitter();
    emitter.emit('boxCreate', data.entries[0]);
    res.send(data);
  });
};

var boxUpload = function(req, cb, failcb ) {
  console.log('call upload');

  console.log(req.body, req.files);
  var doc = req.files.file;

  var parent = boxConfig.appFolderId;
  var url = boxConfig.upload_url + '/files/content';
  console.log(url);

  var config =  {
    url: url
    ,headers: {
      Authorization: 'Bearer ' + boxConfig.access_token
    }};

  var formData = {
    attributes: JSON.stringify( { name: doc.name
      ,parent: { id: parent } })
    ,file: {
      value:  fs.createReadStream(doc.path),
      options: {
        filename: doc.name,
        contentType: doc.type
      }
    }
  };
  config.formData = formData;

  var post = request.post(config, function (err, resp, body) {
    if (err) {
      console.log('Error!');
      return failcb(err);
    } else {
      console.log(body);
      //If statusCode == 401, refresh token and retry
      console.log(resp.statusCode);
      return cb(resp);
    }
  });
};

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
    if (jqXHR.status == 401 && this.url.indexOf(boxConfig.base_ur) == -1) {
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
