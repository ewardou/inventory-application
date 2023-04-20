const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Consoles = require('../models/consoles');
const Games = require('../models/games');
const Accessories = require('../models/accessories');

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
    res.render('console_form', { errors: null });
};

exports.createConsole_Post = [
    body('price').isInt({ min: 1 }).escape(),
    body('quantity').isInt({ min: 1 }).escape(),
    body('name').trim().isLength({ min: 1, max: 100 }).escape(),
    body('manufacturer').trim().isLength({ min: 1, max: 100 }).escape(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const gameConsole = new Consoles({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            manufacturer: req.body.manufacturer,
        });

        if (!errors.isEmpty()) {
            res.render('console_form', {
                console: gameConsole,
                errors: errors.array(),
            });
        } else {
            await gameConsole.save();
            res.redirect('/consoles');
        }
    }),
];

exports.updateConsole = asyncHandler(async (req, res) => {
    const gameConsole = await Consoles.findById(req.params.id).exec();
    res.render('console_form', { console: gameConsole, errors: null });
});

exports.updateConsole_Post = [
    body('price').isInt({ min: 1 }).escape(),
    body('quantity').isInt({ min: 1 }).escape(),
    body('name').trim().isLength({ min: 1, max: 100 }).escape(),
    body('manufacturer').trim().isLength({ min: 1, max: 100 }).escape(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const gameConsole = new Consoles({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            manufacturer: req.body.manufacturer,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render('console_form', {
                console: gameConsole,
                errors: errors.array(),
            });
        } else {
            await Consoles.findByIdAndUpdate(req.params.id, gameConsole, {});
            res.redirect('/consoles');
        }
    }),
];

exports.deleteConsole = asyncHandler(async (req, res) => {
    const [games, accessories] = await Promise.all([
        Games.find({ availableConsoles: req.params.id }).exec(),
        Accessories.find({ availableConsoles: req.params.id }).exec(),
    ]);
    if (games.length <= 0 && accessories.length <= 0) {
        await Consoles.findByIdAndRemove(req.params.id);
        res.redirect('/consoles');
    } else {
        res.render('console_delete', { games, accessories });
    }
});
