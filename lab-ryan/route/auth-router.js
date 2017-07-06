'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../model/user.js');
const authRouter = module.exports = new Router();

authRouter.post('/api/signup', jsonParser, (req, res, next) => {
  console.log('hit/api/signup');

  if(!req.body.username || !req.body.password){
    return next(new Error('invalid body'));

  }

  User.create(req.body)
  .then(token => res.send(token))
  .catch(next);

});

authRouter.get('/api/login', basicAuth, (req, res, next) => {


  req.user.tokenCreate()
.then(token => res.send(token))
.catch(next);
});
