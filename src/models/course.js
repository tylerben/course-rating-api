const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const CourseSchema = new Schema({
  user: {
    type: ObjectId, 
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  estimatedTime: {
    type: String,
    trim: true,
  },
  materialsNeeded: {
    type: String,
    trim: true,
  },
  steps: [
    {
      stepNumber: {
        type: Number,
      },
      title: {
        type: String,
        trim: true,
        required: true,
      },
      description: {
        type: String,
        trim: true,
        required: true,
      },
    }
  ],
  reviews: [
    {
      type: ObjectId, 
      ref: 'Review'
    }
  ],
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;