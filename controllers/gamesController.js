const asyncHandler = require('express-async-handler');
const Games = require('../models/games');

exports.getGames = asyncHandler(async (req, res, next) => {
    const allGames = await Games.find().populate('availableConsoles').exec();
    res.render('games', { allGames, title: 'Available games' });
});
