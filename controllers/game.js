const Game = require('../models/Game');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllGames = async (req, res) => {
  const games = await Game.find();

  res.status(StatusCodes.OK).json({count: games.length, games});
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
