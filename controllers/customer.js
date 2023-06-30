const Customer = require('../models/Customer');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllCustomers = async (req, res) => {
  const {page, limit} = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const customersQuery = Customer.aggregate([
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

  //res.status(StatusCodes.OK).json({count: customers.length, customers});
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
