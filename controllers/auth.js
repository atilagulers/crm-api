const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors');

const register = async (req, res, next) => {
  const {role} = req.user;

  if (role !== 'admin')
    throw new UnauthenticatedError('Authentication invalid');

  const user = await User.create(req.body);
  //const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
    },
    token,
  });
};

const login = async (req, res, next) => {
  const {username, password} = req.body;

  if (!username || !password) {
    throw new BadRequestError('Please provide username and password');
  }

  const user = await User.findOne({username});

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  // compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
    },
    token,
  });
};

module.exports = {register, login};
