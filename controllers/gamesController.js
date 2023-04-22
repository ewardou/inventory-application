const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const deleteImageFromFS = require('../public/javascripts/deleteImage');
const Games = require('../models/games');
const Consoles = require('../models/consoles');

const upload = multer({
    dest: './public/images',
    limits: { fileSize: 1100000 },
});

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
        update: false,
    });
});

exports.createGame_Post = [
    upload.single('article-image'),
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
        const imageName = req.file ? req.file.filename : 'placeholder.png';
        const game = new Games({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            synopsis: req.body.synopsis,
            availableConsoles: req.body.availableConsoles,
            imageName,
        });

        if (!errors.isEmpty()) {
            res.render('game_form', {
                game,
                consoles,
                errors: errors.array(),
                update: false,
            });
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
    res.render('game_form', { game, consoles, errors: null, update: true });
});

exports.updateGame_Post = [
    upload.single('article-image'),
    body('price').trim().isInt({ min: 1 }).escape(),
    body('quantity').trim().isInt({ min: 1 }).escape(),
    body('name').trim().isLength({ min: 1, max: 100 }).escape(),
    body('synopsis').optional().trim().isLength({ max: 1000 }),
    body('availableConsoles').optional().trim(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        let { imageName } = await Games.findById(req.params.id).exec();
        const consoles = await Consoles.find({}).exec();
        if (!req.body.availableConsoles) {
            req.body.availableConsoles = consoles.map((console) => console._id);
        }
        if (req.file) {
            await deleteImageFromFS(imageName);
            imageName = req.file.filename;
        }
        const game = new Games({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            synopsis: req.body.synopsis,
            imageName,
            availableConsoles: req.body.availableConsoles,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render('game_form', {
                game,
                consoles,
                errors: errors.array(),
                update: true,
            });
        } else {
            await Games.findByIdAndUpdate(req.params.id, game, {});
            res.redirect('/games');
        }
    }),
];

exports.deleteGame = asyncHandler(async (req, res) => {
    const { imageName } = await Games.findById(req.params.id).exec();
    await Promise.all([
        Games.findByIdAndRemove(req.params.id),
        deleteImageFromFS(imageName),
    ]);
    res.redirect('/games');
});
