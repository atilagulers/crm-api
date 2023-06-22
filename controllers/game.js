const Game = require('../models/Game');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');
const User = require('../models/User');

const getAllGames = async (req, res) => {
  const {page, limit} = req.params;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const gamesQuery = Game.aggregate([{$skip: skip}, {$limit: limitNumber}]);

  const countQuery = Game.countDocuments();

  const [games, totalCount] = await Promise.all([gamesQuery, countQuery]);

  res.status(StatusCodes.OK).json({
    totalCount,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalCount / limitNumber),
    games,
  });
};

const getGame = async (req, res) => {
  const {id: gameId} = req.params;

  const game = await Game.findById(gameId);

  if (!game) throw new NotFoundError(`No game with id ${gameId}`);

  res.status(StatusCodes.OK).json(game);
};

const createGame = async (req, res) => {
  const game = await Game.create(req.body);

  res.status(StatusCodes.CREATED).json(game);
};

const updateGame = async (req, res) => {
  const {id: gameId} = req.params;

  const game = await Game.findByIdAndUpdate(gameId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!game) throw new NotFoundError(`No game with id ${gameId}`);

  res.status(StatusCodes.OK).json(game);
};

module.exports = {getAllGames, getGame, createGame, updateGame};
