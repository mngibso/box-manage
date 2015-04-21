'use strict';

var express = require('express');
var controller = require('./box.controller.js');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var router = express.Router();

router.get('/', controller.contents); // contents of the base folder defined in env
router.get('/folders/:folder_id/items', controller.contents); //contents of folder_id
router.get('/token', controller.token); //refresh token
router.get('/:file_id', controller.download); //returns a link to the file
router.post('/', multipartMiddleware, controller.upload);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
