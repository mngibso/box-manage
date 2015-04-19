'use strict';

var express = require('express');
var controller = require('./box.controller.js');

var router = express.Router();

//router.get('/', controller.index);
router.get('/folders/:folder_id/items', controller.contents); //refresh token
router.get('/token', controller.token); //refresh token
//router.get('/:id', controller.show);
//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
