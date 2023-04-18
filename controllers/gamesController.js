const asyncHandler = require('express-async-handler');
const Games = require('../models/games');

exports.getGames = asyncHandler(async (req, res) => {
    const allGames = await Games.find().populate('availableConsoles').exec();
    res.render('games', { allGames, title: 'Available games' });
});

exports.getGameDetails = asyncHandler(async (req, res) => {
    const [game] = await Games.find({ _id: req.params.id })
        .populate('availableConsoles')
        .exec();
    console.log(game);
    res.render('game_detail', { game });
});

exports.createGame = (req, res) => {
    res.render('game_create');
};
