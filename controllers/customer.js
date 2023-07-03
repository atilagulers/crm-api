const Customer = require('../models/Customer');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllCustomers = async (req, res) => {
  const {page, limit, willBeCalled, callDate, sortBy, sortOrder} = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const filter = {};
  if (willBeCalled === 'true') {
    filter.willBeCalled = true;
  } else if (willBeCalled === 'false') {
    filter.willBeCalled = false;
  }

  if (callDate && willBeCalled) {
    if (callDate === 'future') {
      const today = new Date();
      filter.callDate = {$gte: today};
    } else if (callDate === 'today') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      filter.callDate = {$gte: todayStart, $lte: todayEnd};
    }
  }

  const sort = {};
  if (sortBy && sortOrder) {
    sort[sortBy] = parseInt(sortOrder);
  }
  const customersQuery = Customer.aggregate([
    {$match: filter},

    {$sort: sort},
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
      $lookup: {
        from: 'customergroups',
        localField: 'customerGroup',
        foreignField: '_id',
        as: 'customerGroup',
      },
    },
    {
      $project: {
        'user.password': 0,
      },
    },
  ]);

  const countQuery = Customer.countDocuments();

  const [customers, totalCount] = await Promise.all([
    customersQuery,
    countQuery,
  ]);

  res.status(StatusCodes.OK).json({
    totalCount,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalCount / limitNumber),
    customers,
  });
};

const getCustomer = async (req, res) => {
  const {id: customerId} = req.params;

  const customer = await Customer.findById(customerId).populate(
    'user',
    '-password'
  );

  if (!customer) throw new NotFoundError(`No customer with id ${customerId}`);

  res.status(StatusCodes.OK).json(customer);
};

const createCustomer = async (req, res) => {
  const customer = await Customer.create(req.body);

  res.status(StatusCodes.CREATED).json(customer);
};

const updateCustomer = async (req, res) => {
  const {id: customerId} = req.params;
  const customer = await Customer.findByIdAndUpdate(customerId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!customer) throw new NotFoundError(`No customer with id ${customerId}`);

  res.status(StatusCodes.OK).json(customer);
};

module.exports = {getAllCustomers, getCustomer, createCustomer, updateCustomer};
