'use strict';

const express = require('express');
const User = require('./../models/user');
const auth = require('basic-auth');
const { handleError } = require('./../util');
const { authenticateUser } = require('./../middleware');

const router = express.Router();

// GET users
// Route for fetching currently authenticated user
router.get('/', authenticateUser, (req, res, next) => {
  res.json(req.user);
});

// POST users
// Route for creating a new user
router.post('/', (req, res, next) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) return handleError(err, req, res, next);
    res.redirect(201, '/');
  });
});

module.exports = router;
