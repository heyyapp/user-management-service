const express = require('express');
const route = express.Router();

route.post('/create', require('./routeComponents/createComponent'));
route.post('/login', require('./routeComponents/loginComponent'));
route.post('/logout', require('./routeComponents/logoutComponent'));
route.post('/regenerate-tokens', require('./routeComponents/regenerateTokenComponent'));

module.exports = route;