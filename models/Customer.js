const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  tc: {
    type: String,
    required: [true, 'Please provide TC'],
    minLength: 11,
    maxLength: 11,
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
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
    minLength: 3,
    maxLength: 30,
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
      values: ['erkek', 'kadın', 'bilinmiyor'],
      message: '{VALUE} is not supported',
    },
    default: 'agent',
    required: [true, 'gender must be provided'],
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
