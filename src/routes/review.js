'use strict';

const express = require('express');
const Review = require('./../models/review');
const router = express.Router();

// GET /api/courses
// Route for fetching all courses
router.get('/', (req, res, next) => {
  Course
    .find({})
    .select(['_id', 'title'])
    .exec((err, courses) => {
      if (err) return next(err);
      res.json(courses);
    });
});

// GET /api/courses/:courseId
// Returns all Course properties and related documents for the provided course ID
router.get('/:courseId', (req, res, next) => {
  const { courseId } = req.params;
  Course
    .findById(courseId)
    .populate({
      path: 'reviews',
      model: 'Review',
      populate: {
          path: 'user',
          model: 'User'
      }
    })
    .exec((err, courses) => {
      if (err) return next(err);
      res.json(courses);
    });
});


module.exports = router;
