const mongoose = require('mongoose');

const CustomerGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    unique: true,
  },
  explanation: {
    type: String,
    required: [true, 'Please provide explanation'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

module.exports = mongoose.model('CustomerGroup', CustomerGroupSchema);
