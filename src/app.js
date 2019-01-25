'use strict';

// load modules
const express = require('express');
const jsonParser = require('body-parser').json;
const morgan = require('morgan');
const mongoose = require('mongoose');
const UserRoutes = require('./routes/user');
const CourseRoutes = require('./routes/course');
const ReviewRoutes = require('./routes/review');
const { setHeaders } = require('./middleware');

const app = express();

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));
app.use(jsonParser());

// Connect to the mongo database
mongoose.connect('mongodb://localhost:27017/course-api', { useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('Connection error:', err);
});
db.once('open', () => {
  console.log('DB connection successful');
});

// Configure headers
app.use(setHeaders);

// TODO add additional routes here
app.use('/api/users', UserRoutes);
app.use('/api/courses', CourseRoutes);
app.use('/api/reviews', ReviewRoutes);

// send a friendly greeting for the root route
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Welcome to the Course Review API'
//   });
// });

// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error');
// });

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

module.exports = server;
