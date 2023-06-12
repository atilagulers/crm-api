const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    minLength: 3,
    maxLength: 20,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    minLength: 3,
    maxLength: 20,
  },
  username: {
    type: String,
    required: [true, 'Please provide username'],
    minLength: 3,
    maxLength: 20,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: 8,
  },
});

module.exports = mongoose.model('User', UserSchema);