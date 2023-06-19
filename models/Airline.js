const mongoose = require('mongoose');

const AirlineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide game name'],
    minLength: 3,
    maxLength: 30,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

module.exports = mongoose.model('Airline', AirlineSchema);
