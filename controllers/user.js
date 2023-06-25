const User = require('../models/User');
const {UnauthenticatedError, NotFoundError} = require('../errors');
const {StatusCodes} = require('http-status-codes');

const getAllUsers = async (req, res) => {
  const {role} = req.user;
  const {page, limit, sortBy, sortOrder} = req.query;

  if (role !== 'admin')
    throw new UnauthenticatedError('Authentication invalid');

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;
  const sortField = sortBy || 'firstName';
  const sortDirection = parseInt(sortOrder) || 1;

  const sortQuery = {[sortField]: sortDirection};

  const collationOptions = {
    locale: 'tr',
    caseLevel: false,
    caseFirst: 'off',
    strength: 2,
  };

  const usersQuery = User.aggregate([
    {$sort: sortQuery},
    {$skip: skip},
    {$limit: limitNumber},
  ]).collation(collationOptions);

  const countQuery = User.countDocuments();

  const [users, totalCount] = await Promise.all([usersQuery, countQuery]);

  res.status(StatusCodes.OK).json({
    totalCount,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalCount / limitNumber),
    users,
  });
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
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    role: user.role,
  });
};

const updateUser = async (req, res, next) => {
  const {role} = req.user;
  const {id: userId} = req.params;

  if (role !== 'admin')
    throw new UnauthenticatedError('Authentication invalid');

  const user = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new NotFoundError(`No user with id ${userId}`);

  res.status(StatusCodes.OK).json(user);
};

module.exports = {getAllUsers, getUser, createUser, updateUser};
