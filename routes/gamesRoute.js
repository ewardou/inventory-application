const express = require('express');
const gamesController = require('../controllers/gamesController');

const router = express.Router();

router.get('/games', gamesController.getGames);

module.exports = router;
