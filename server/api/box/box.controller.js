'use strict';

var request = require('request');
var jq = require('jquery');
var http = require('http');
var BoxToken = require('./box.model').BoxToken;
var boxConfig = require('../../config/environment').box;
var fs = require('fs');
var async = require('async');
var emitter = require('./box.socket.js').Emitter.getInstance();

jq.support.cors = true;
//Refresh the Box access and refresh tokens
var refreshToken = function(cb, failcb) {
  BoxToken.findOne(function (err, token) {
    if (err) {
      return failcb(err);
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
        failcb(errorThrown);
      });

  });

};

exports.token = function(req, res, next){
  //non 401 error
  try {
    // Box error?
    var obj = JSON.parse(response.body);
    if (obj.error){
      return callback(obj.error);
    }
  } catch(err) {}

  //Return error
  callback({message: 'Unknown Box API error', status: response.statusCode});
  refreshToken(function(data) { res.send(data); },
    function(err) { next(err); });
};
//curl https://api.box.com/2.0/files/FILE_ID
//ToDo - store results of this call in redis
exports.info = function(req, res, next) {
  var file_id = req.params.file_id;
  var url = boxConfig.base_url + '/files/' + file_id;
  if(req.query.fields) url = url + '?fields=' + req.query.fields;
  jq.ajax(url, {
    headers: {
      Authorization: 'Bearer ' + boxConfig.access_token
    }
  })
    .done(function (data, textStatus, jqXHR) {
    res.send(data);
  })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.getResponseHeader('www-authenticate'));
      next(errorThrown);

    });
}

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
    res.send(data);
  })
    .fail( function( jqXHR, textStatus, errorThrown ){
      console.log(jqXHR.getResponseHeader('www-authenticate'));
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
      if(jqXHR.status == 302){
        //This is the expected return
        var url = jqXHR.getResponseHeader('location') || '';
        if(url) return res.send({url: url});
      }
      next(errorThrown);
    });
};

//ToDo - need to pass file etag in qs
exports.destroy = function(req, res, next) {
  var file_id = req.params.file_id;
  var url = boxConfig.base_url + '/files/' + file_id;
  //This call should return a 302 with the location header

  //Access file_id in callback
  var destroycb = (function(file_id){
    return function( data, textStatus, jqXHR ) {
        if(jqXHR.status != 204) return next({error: 'Unexpected result'});
        console.log('DELETED ' + file_id);
        emitter.emit('boxDestroy', {id: file_id} );
        res.send({status: 204});
      };
  })(file_id);

  jq.ajax(url, {
    type: 'DELETE'
    ,headers: {
      Authorization: 'Bearer ' + boxConfig.access_token
      ,'If-Match': '0'
    }
  })
    .done( destroycb )
    .fail( function( jqXHR, textStatus, errorThrown ){
      console.log(errorThrown);
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
          try {
            // Box error?
            var obj = JSON.parse(response.body);
            if (obj.type == 'error'){
              return callback(obj);
            }
          } catch(err) {}

          //Return error
          callback({message: 'Unknown Box API error', status: response.statusCode});
        }
        , function (err) {
          callback(err);
        });
    }
    , function(retry, response, callback) {
      if(retry) {
        refreshToken(function(access){
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
    try {
      var data = JSON.parse(response.body);
    } catch (err) {
      var data = {error: err};
    }
    emitter.emit('boxCreate', data.entries[0]);
    res.send(data);
  });
};
//ToDo - can I use streams here?
/*
 app.post('myroute', function (req, res) {
 var request = require('request');
 req.pipe(request.post('/my/path:5000')).pipe(res);
 });
 */
var boxUpload = function(req, cb, failcb ) {
  var doc = req.files.file;

  var parent = boxConfig.appFolderId;
  var url = boxConfig.upload_url + '/files/content';

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
      return failcb(err);
    } else {
      return cb(resp);
    }
  });
};


// If box api 401, refresh token and retry
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
