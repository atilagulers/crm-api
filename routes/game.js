const express = require('express');
const router = express.Router();

const {
  getAllGames,
  getGame,
  createGame,
  updateGame,
} = require('../controllers/game');

router.route('/').get(getAllGames).post(createGame);
router.route('/:id').get(getGame).patch(updateGame);

module.exports = router;
