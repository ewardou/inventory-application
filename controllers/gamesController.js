const asyncHandler = require('express-async-handler');
const Games = require('../models/games');
const Consoles = require('../models/consoles');

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

exports.createGame = asyncHandler(async (req, res) => {
    const allConsoles = await Consoles.find().exec();
    res.render('game_form', {
        consoles: allConsoles,
        game: undefined,
    });
});

exports.updateGame = asyncHandler(async (req, res) => {
    const [game, consoles] = await Promise.all([
        Games.findById(req.params.id).exec(),
        Consoles.find().exec(),
    ]);
    game.availableConsoles.forEach((availableConsole) => {
        consoles.forEach((console) => {
            if (console._id.toString() === availableConsole.toString()) {
                console.checked = true;
            }
        });
    });
    res.render('game_form', { game, consoles });
});

exports.deleteGame = asyncHandler(async (req, res) => {
    await Games.findByIdAndRemove(req.params.id);
    res.redirect('/games');
});
