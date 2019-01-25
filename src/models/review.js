const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const ReviewSchema = new Schema({
  user: {
    type: ObjectId, 
    ref: 'User'
  },
  postedOn: {
    type: Date, 
    default: Date.now,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    trim: true,
  },
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;