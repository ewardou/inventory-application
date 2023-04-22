const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const deleteImageFromFS = require('../public/javascripts/deleteImage');
const Consoles = require('../models/consoles');
const Games = require('../models/games');
const Accessories = require('../models/accessories');

const upload = multer({
    dest: './public/images',
    limits: { fileSize: 1100000 },
});

exports.getConsoles = asyncHandler(async (req, res) => {
    const allConsoles = await Consoles.find().exec();
    res.render('consoles', { allConsoles, title: 'Available Consoles' });
});

exports.getConsoleDetails = asyncHandler(async (req, res) => {
    const [gameConsole, availableGames, availableAccessories] =
        await Promise.all([
            Consoles.findById(req.params.id).exec(),
            Games.find({ availableConsoles: req.params.id }).exec(),
            Accessories.find({ availableConsoles: req.params.id }).exec(),
        ]);
    res.render('console_detail', {
        console: gameConsole,
        availableGames,
        availableAccessories,
    });
});

exports.createConsole = (req, res) => {
    res.render('console_form', { errors: null, update: false });
};

exports.createConsole_Post = [
    upload.single('article-image'),
    body('price').isInt({ min: 1 }).escape(),
    body('quantity').isInt({ min: 1 }).escape(),
    body('name').trim().isLength({ min: 1, max: 100 }).escape(),
    body('manufacturer').trim().isLength({ min: 1, max: 100 }).escape(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const imageName = req.file ? req.file.filename : 'placeholder.png';
        const gameConsole = new Consoles({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            manufacturer: req.body.manufacturer,
            imageName,
        });

        if (!errors.isEmpty()) {
            res.render('console_form', {
                console: gameConsole,
                errors: errors.array(),
                update: false,
            });
        } else {
            await gameConsole.save();
            res.redirect('/consoles');
        }
    }),
];

exports.updateConsole = asyncHandler(async (req, res) => {
    const gameConsole = await Consoles.findById(req.params.id).exec();
    res.render('console_form', {
        console: gameConsole,
        errors: null,
        update: true,
    });
});

exports.updateConsole_Post = [
    upload.single('article-image'),
    body('price').isInt({ min: 1 }).escape(),
    body('quantity').isInt({ min: 1 }).escape(),
    body('name').trim().isLength({ min: 1, max: 100 }).escape(),
    body('manufacturer').trim().isLength({ min: 1, max: 100 }).escape(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        let { imageName } = await Consoles.findById(req.params.id).exec();
        if (req.file) {
            await deleteImageFromFS(imageName);
            imageName = req.file.filename;
        }
        const gameConsole = new Consoles({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            imageName,
            manufacturer: req.body.manufacturer,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render('console_form', {
                console: gameConsole,
                errors: errors.array(),
                update: true,
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
        const { imageName } = await Consoles.findById(req.params.id).exec();
        await Promise.all([
            Consoles.findByIdAndRemove(req.params.id),
            deleteImageFromFS(imageName),
        ]);
        res.redirect('/consoles');
    } else {
        res.render('console_delete', { games, accessories });
    }
});
