const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  emailAddress: { 
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
          return emailRegex.test(v);
      },
      message: props => `${props.value} is not a valid email address`
    },        
  },
  password: {
    type: String,
    required: true,
  },
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(emailAddress, password, callback) {
  User
    .findOne({ emailAddress })
    .exec((err, user) => {
      if (err) {
        return callback(err);
      } else if (!user) {
        const error = new Error('User not found');
        error.status = 401;
        return callback(error);
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      });
    });
}

UserSchema.pre('save', function(next) {
    const user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) next(err);
        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;