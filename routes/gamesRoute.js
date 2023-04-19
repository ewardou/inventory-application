const express = require('express');
const gamesController = require('../controllers/gamesController');

const router = express.Router();

router.get('/games', gamesController.getGames);
router.get('/games/create', gamesController.createGame);
router.post('/games/create', gamesController.createGame_Post);
router.get('/games/:id', gamesController.getGameDetails);
router.get('/games/:id/update', gamesController.updateGame);
router.post('/games/:id/update', gamesController.updateGame_Post);
router.post('/games/:id/delete', gamesController.deleteGame);

module.exports = router;
