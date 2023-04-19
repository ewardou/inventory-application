const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Accessories = require('../models/accessories');
const Consoles = require('../models/consoles');

exports.getAccessories = asyncHandler(async (req, res) => {
    const allAccessories = await Accessories.find()
        .populate('availableConsoles')
        .exec();
    res.render('games', {
        allGames: allAccessories,
        title: 'Available accessories',
    });
});

exports.getAccessoryDetails = asyncHandler(async (req, res) => {
    const accessory = await Accessories.findById(req.params.id)
        .populate('availableConsoles')
        .exec();
    res.render('game_detail', { game: accessory });
});

exports.createAccessory = asyncHandler(async (req, res) => {
    const allConsoles = await Consoles.find().exec();
    res.render('accessory_form', {
        consoles: allConsoles,
        accessory: undefined,
        errors: null,
    });
});

exports.createAccessory_Post = [
    body('price').trim().isInt({ min: 1 }).escape(),
    body('quantity').trim().isInt({ min: 1 }).escape(),
    body('name').trim().isLength({ min: 1, max: 100 }).escape(),
    body('availableConsoles').optional().trim(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const consoles = await Consoles.find({}).exec();
        if (!req.body.availableConsoles) {
            req.body.availableConsoles = consoles.map((console) => console._id);
        }
        const accessory = new Accessories({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            availableConsoles: req.body.availableConsoles,
        });

        if (!errors.isEmpty()) {
            res.render('accessory_form', {
                accessory,
                consoles,
                errors: errors.array(),
            });
        } else {
            await accessory.save();
            res.redirect('/accessories');
        }
    }),
];
