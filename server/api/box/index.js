'use strict';

var express = require('express');
var controller = require('./box.controller.js');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var router = express.Router();

//router.get('/', controller.index);
router.get('/folders/:folder_id/items', controller.contents); //refresh token
router.get('/token', controller.token); //refresh token
//router.get('/:id', controller.show);
router.post('/', multipartMiddleware, controller.upload);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
