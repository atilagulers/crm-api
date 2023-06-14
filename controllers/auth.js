const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError} = require('../errors');

const register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
      user: {
        firstName: user.getFirstName(),
        lastName: user.lastName,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  res.send('login user');
};

module.exports = {register, login};
