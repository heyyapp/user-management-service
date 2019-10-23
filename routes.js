const express = require('express');
const route = express.Router();

route.post('/create', require('./routeComponents/createComponent'));
route.post('/login', require('./routeComponents/loginComponent'));

module.exports = route;