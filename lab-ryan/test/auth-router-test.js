'use strict';

// load test env
require('dotenv').config({path: `${__dirname}/../.test.env`});

// load npm modules
const expect = require('expect');
const superagent = require('superagent');

// load app modules
const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/mock-user.js');

const API_URL = process.env.API_URL;

describe('testing auth router', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('testing POST /api/signup', () => {
    it('should respond with a token', () => {
      return superagent.post(`${API_URL}/api/signup`)
      .send({
        username: 'test_user',
        password: 'top secret',
        email: 'test_user@whatever.youmakeit',
      })
      .then(res => {
        console.log('token we go back ', res.text);
        expect(res.status).toEqual(200);
        expect(res.text).toExist();
        expect(res.text.length > 1).toBeTruthy();
      });
    });
    it('should respond with a 400 status', () => {
      return superagent.post(`${API_URL}/api/signup`)
      .send({
        password: 'its a secret',
        email: 'test_user@whatever.youmakeit',
      })
    .catch(res => {
      expect(res.status).toEqual(400);
    });
    });
  });
  describe('testing GET /api/login', () => {
    it.only('should respond with a token', () => {
      let tempUser;
      return mockUser.createOne()
      .then(userData => {
        tempUser = userData.user;
        console.log('tempUser', tempUser);
        let encoded = new Buffer(`${tempUser.username}:${userData.password}`).toString('base64');
        return superagent.get(`${API_URL}/api/login`)
        .set('Authorization', `Basic ${encoded}`);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.text).toExist();
        expect(res.text.length > 1).toBeTruthy();
      });
    });
    it('should respond with a 401 status', () => {
      let tempUser;
      return mockUser.createOne()
      .then(userData => {
        tempUser = userData.user;
        let encoded = new Buffer(`${tempUser.username}:asdf`).toString('base64');
        return superagent.get(`${API_URL}/api/login`)
        .set('Authorization', `Basic ${encoded}`);
      })
      .catch(res => {
        expect(res.status).toEqual(401);
      });
    });
  });

});
