const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({userId: this._id}, 'jwtSecret', {
    expiresIn: '30d',
  });
};

module.exports = mongoose.model('User', UserSchema);
