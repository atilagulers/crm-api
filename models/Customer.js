const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  tc: {
    type: String,
    unique: true,
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
    unique: true,
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
  customerGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerGroup',
  },
  calls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Call',
    },
  ],
  willBeCalled: {
    type: Boolean,
    default: false,
  },
  callDate: {
    type: Date,
    default: null,
  },
  waitingReservation: {
    type: Boolean,
    default: false,
  },
  isReserved: {
    type: Boolean,
    default: false,
  },
  reservationDate: {
    type: Date,
    default: null,
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
