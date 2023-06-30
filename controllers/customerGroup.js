const CustomerGroup = require('../models/CustomerGroup');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllCustomerGroups = async (req, res) => {
  const {page, limit} = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) | 10;
  const skip = (pageNumber - 1) * limitNumber;

  const customerGroupsQuery = CustomerGroup.aggregate([
    {$skip: skip},
    {$limit: limitNumber},
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $project: {
        'user.password': 0,
      },
    },
  ]);

  const countQuery = CustomerGroup.countDocuments();

  const [customerGroups, totalCount] = await Promise.all([
    customerGroupsQuery,
    countQuery,
  ]);

  res.status(StatusCodes.OK).json({
    totalCount,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalCount / limitNumber),
    customerGroups,
  });
};

const getCustomerGroup = async (req, res) => {
  const {id: customerGroupId} = req.params;

  const customerGroup = await CustomerGroup.findById(customerGroupId);

  if (!customerGroup)
    throw new NotFoundError(`No customer group with id ${customerGroupId}`);

  res.status(StatusCodes.OK).json(customerGroup);
};

const createCustomerGroup = async (req, res) => {
  const customerGroup = await CustomerGroup.create(req.body);

  res.status(StatusCodes.CREATED).json(customerGroup);
};

const updateCustomerGroup = async (req, res) => {
  const {id: customerGroupId} = req.params;
  const customerGroup = await CustomerGroup.findByIdAndUpdate(
    customerGroupId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!customerGroup)
    throw new NotFoundError(`No customer group with id ${customerGroupId}`);

  res.status(StatusCodes.OK).json(customerGroup);
};

module.exports = {
  getAllCustomerGroups,
  getCustomerGroup,
  createCustomerGroup,
  updateCustomerGroup,
};
