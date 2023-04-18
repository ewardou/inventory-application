const express = require('express');
const gamesController = require('../controllers/gamesController');

const router = express.Router();

router.get('/games', gamesController.getGames);
router.get('/games/create', gamesController.createGame);
router.get('/games/:id', gamesController.getGameDetails);
router.get('/games/:id/update', gamesController.updateGame);
router.post('/games/:id/delete', gamesController.deleteGame);

module.exports = router;
