const asyncHandler = require('express-async-handler');
const Consoles = require('../models/consoles');
const Games = require('../models/games');

exports.getConsoles = asyncHandler(async (req, res) => {
    const allConsoles = await Consoles.find().exec();
    res.render('consoles', { allConsoles, title: 'Available Consoles' });
});

exports.getConsoleDetails = asyncHandler(async (req, res) => {
    const [gameConsole, availableGames] = await Promise.all([
        Consoles.findById(req.params.id).exec(),
        Games.find({ availableConsoles: req.params.id }).exec(),
    ]);
    res.render('console_detail', { console: gameConsole, availableGames });
});

exports.createConsole = (req, res) => {
    res.render('console_form');
};
