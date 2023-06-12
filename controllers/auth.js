const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError} = require('../errors');

const register = async (req, res, next) => {
  const {firstName, lastName, username, password} = req.body;

  try {
    if (!firstName || !lastName || !username || !password) {
      throw new BadRequestError(
        'Please provide first name, last name, username and password'
      );
    }

    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  res.send('login user');
};

module.exports = {register, login};
