const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Please provide customer'],
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Please provide hotel'],
  },
  departureAirline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airline',
    required: [true, 'Please provide departure airline'],
  },
  departureDate: {
    type: Date,
    required: [true, 'Please provide departure date'],
  },
  departureTime: {
    type: String,
    required: [true, 'Please provide departure time'],
  },
  departureDestination: {
    type: String,
    required: [true, 'Please provide departure destination'],
  },
  departurePNR: {
    type: String,
    required: [true, 'Please provide departure PNR'],
  },
  arrivalAirline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airline',
    required: [true, 'Please provide arrival airline'],
  },
  arrivalDate: {
    type: Date,
    required: [true, 'Please provide arrival date'],
  },
  arrivalTime: {
    type: String,
    required: [true, 'Please provide arrival time'],
  },
  arrivalDestination: {
    type: String,
    required: [true, 'Please provide arrival destination'],
  },
  arrivalPNR: {
    type: String,
    required: [true, 'Please provide arrival PNR'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    //select: false,
  },
});

module.exports = mongoose.model('Reservation', ReservationSchema);
