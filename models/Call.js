const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  callLog: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

module.exports = mongoose.model('Customer', CustomerSchema);
