const express = require('express');
const controllers = require('../controllers/controllers');

const route = express.Router();

route.route('/').get(controllers.handle_get_request);

route.route('/showifopen').post(controllers.handle_post_request);

module.exports = route;