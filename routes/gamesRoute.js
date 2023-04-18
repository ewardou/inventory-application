const express = require('express');
const gamesController = require('../controllers/gamesController');

const router = express.Router();

router.get('/games', gamesController.getGames);
router.get('/games/create', gamesController.createGame);
router.get('/games/:id', gamesController.getGameDetails);

module.exports = router;
