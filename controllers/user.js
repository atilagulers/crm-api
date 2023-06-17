const User = require('../models/User');
const {UnauthenticatedError, NotFoundError} = require('../errors');
const {StatusCodes} = require('http-status-codes');

const getAllUsers = async (req, res) => {
  const {role} = req.user;

  if (role !== 'admin')
    throw new UnauthenticatedError('Authentication invalid');

  const users = await User.find();

  res.status(StatusCodes.OK).json({count: users.length, users});
};

const getUser = async (req, res) => {
  const {role} = req.user;
  const {id: userId} = req.params;

  if (role !== 'admin')
    throw new UnauthenticatedError('Authentication invalid');

  const user = await User.findById(userId).select('-password');

  if (!user) throw new NotFoundError(`No user with id ${userId}`);

  res.status(StatusCodes.OK).json(user);
};

const createUser = async (req, res, next) => {
  const {role} = req.user;

  if (role !== 'admin')
    throw new UnauthenticatedError('Authentication invalid');

  const user = await User.create(req.body);

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

const updateUser = async (req, res, next) => {
  const {role} = req.user;
  const {id: userId} = req.params;

  if (role !== 'admin')
    throw new UnauthenticatedError('Authentication invalid');

  const user = await User.findByIdAndUpdate({_id: userId}, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new NotFoundError(`No user with id ${userId}`);

  res.status(StatusCodes.OK).json(user);
};

module.exports = {getAllUsers, getUser, createUser, updateUser};
