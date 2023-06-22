const {CustomError} = require('../errors');
const {StatusCodes} = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  if (err.name == 'MongoServerError') {
    if (err.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({err});
    }
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({msg: err.message});
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
};

module.exports = errorHandlerMiddleware;
