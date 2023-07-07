const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide reservation name'],
    minLength: 3,
    maxLength: 30,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

module.exports = mongoose.model('Reservation', ReservationSchema);
