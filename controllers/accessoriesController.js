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
