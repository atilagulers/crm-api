const mongoose = require('mongoose');

const CallSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  log: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    //select: false,
  },
});

module.exports = mongoose.model('Call', CallSchema);
