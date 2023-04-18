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
    res.render('game_detail', { game });
});

exports.createGame = (req, res) => {
    res.render('game_form');
};

exports.updateGame = asyncHandler(async (req, res) => {
    const [game] = await Games.find({ _id: req.params.id })
        .populate('availableConsoles')
        .exec();
    const checked = {
        nintendo: false,
        xbox: false,
        playstation: false,
    };
    game.availableConsoles.forEach((console) => {
        Object.keys(checked).forEach((key) => {
            if (console.name.toLowerCase().includes(key)) {
                checked[key] = true;
            }
        });
    });
    res.render('game_form', { game, checked });
});

exports.deleteGame = asyncHandler(async (req, res) => {
    await Games.findByIdAndRemove(req.params.id);
    res.redirect('/games');
});
