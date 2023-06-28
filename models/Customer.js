const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  tc: {
    type: String,
  },
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    minLength: 3,
    maxLength: 30,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    minLength: 3,
    maxLength: 30,
  },
  phone1: {
    type: String,
    required: [true, 'Please provide phone 1'],
  },
  phone2: {
    type: String,
  },
  phone3: {
    type: String,
  },
  email: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  address: {
    type: String,
  },
  workAddress: {
    type: String,
  },
  city: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  gender: {
    type: String,
    trim: true,
    enum: {
      values: ['erkek', 'kadin'],
      message: '{VALUE} is not supported',
    },
    default: 'erkek',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

module.exports = mongoose.model('Customer', CustomerSchema);
