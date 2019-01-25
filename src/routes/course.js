'use strict';

const express = require('express');
const Course = require('./../models/course');
const Review = require('./../models/review');
const { handleError } = require('./../util');
const { authenticateUser } = require('./../middleware');
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
    .populate('reviews')
    .populate('user')
    .exec((err, courses) => {
      if (err) return next(err);
      res.json(courses);
    });
});

// POST /api/courses
// Route for creating a new course
router.post('/', authenticateUser, (req, res, next) => {
  const course = new Course(req.body);
  course.save((err, course) => {
    if (err) return handleError(err, req, res, next);
    res.redirect(201, '/');
  });
});

// PUT /api/courses/:courseId
// Updates a course and returns no content
router.put('/:courseId', authenticateUser, (req, res, next) => {
  const { courseId } = req.params;
  const props = req.body;
  delete props._id;

  Course
    .findByIdAndUpdate(courseId, { $set: props }, function (err, course) {
      if (err) return handleError(err, req, res, next);
      res.redirect(204, '/');
    });
});

// POST /api/courses/:courseId/reviews 201
// Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
router.post('/:courseId/reviews', authenticateUser, (req, res, next) => {
  const { courseId } = req.params;
  const review = new Review(req.body);

  review.save((err, review) => {
    if (err) return handleError(err, req, res, next);
    Course
      .findById(courseId, function (err, course) {
        if (err) return handleError(err, req, res, next);
        course.reviews.push(review.id);
        course.save(function (err, updatedCourse) {
          if (err) return handleError(err, req, res, next);
          res.redirect(201, `/${courseId}`);
        });
      }); 
  });
});

module.exports = router;
