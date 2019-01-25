const auth = require('basic-auth');
const User = require('./../models/user');

function setHeaders(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE');
    return res.status(200).json({});
  }
  next();
}

function authenticateUser(req, res, next) {
  const user = auth(req);

  if (user) {    
    const emailAddress = user.name;
    const password = user.pass;
    User.authenticate(emailAddress, password, (err, user) => {
      if (err || !user) {
        const error = new Error('Wrong email or password.');
        error.status = 401;
        return next(error);
      } else {
        req.user = user;
        return next();
      }
    });
  } else {
    const err = new Error('Please provide an Email and password.');
    err.status = 401;
    return next(err);
  }
}

module.exports.setHeaders = setHeaders;
module.exports.authenticateUser = authenticateUser;