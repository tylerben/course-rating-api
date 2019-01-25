const request = require('supertest');
const app = require('../app');

//==================== user API test ====================

/**
 * Testing get all users endpoint
 */
describe('GET /users', function () {
  it('respond with json containing a list of all users if the correct credentials are provided', function (done) {
      this.timeout(0);
      request(app)
          .get('/api/users')
          .auth('test4@user.com', 'password')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
  });
});

/**
 * Testing /api/courses/:courseId endpoint
 */
describe('GET /api/courses/:courseId', function () {
  it('respond with json containing a list of all users if the correct credentials are provided', function (done) {
      this.timeout(0);
      request(app)
          .get('/api/courses/5c33e95de20a8d11cc8cd024')
          .auth('test2@user.com', 'invalidPassword')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401, done);
  });
});