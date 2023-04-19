const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
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
        errors: null,
    });
});

exports.createGame_Post = [
    body('price').trim().isInt({ min: 1 }).escape(),
    body('quantity').trim().isInt({ min: 1 }).escape(),
    body('name').trim().isLength({ min: 1, max: 100 }).escape(),
    body('synopsis').optional().trim().isLength({ max: 1000 }),
    body('availableConsoles').optional().trim(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const consoles = await Consoles.find({}).exec();
        if (!req.body.availableConsoles) {
            req.body.availableConsoles = consoles.map((console) => console._id);
        }
        const game = new Games({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            synopsis: req.body.synopsis,
            availableConsoles: req.body.availableConsoles,
        });

        if (!errors.isEmpty()) {
            res.render('game_form', { game, consoles, errors: errors.array() });
        } else {
            await game.save();
            res.redirect('/games');
        }
    }),
];

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
    res.render('game_form', { game, consoles, errors: null });
});

exports.updateGame_Post = [
    body('price').trim().isInt({ min: 1 }).escape(),
    body('quantity').trim().isInt({ min: 1 }).escape(),
    body('name').trim().isLength({ min: 1, max: 100 }).escape(),
    body('synopsis').optional().trim().isLength({ max: 1000 }),
    body('availableConsoles').optional().trim(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const consoles = await Consoles.find({}).exec();
        if (!req.body.availableConsoles) {
            req.body.availableConsoles = consoles.map((console) => console._id);
        }
        const game = new Games({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            synopsis: req.body.synopsis,
            availableConsoles: req.body.availableConsoles,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render('game_form', { game, consoles, errors: errors.array() });
        } else {
            await Games.findByIdAndUpdate(req.params.id, game, {});
            res.redirect('/games');
        }
    }),
];

exports.deleteGame = asyncHandler(async (req, res) => {
    await Games.findByIdAndRemove(req.params.id);
    res.redirect('/games');
});
