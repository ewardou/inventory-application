const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const deleteImageFromFS = require('../public/javascripts/deleteImage');
const Accessories = require('../models/accessories');
const Consoles = require('../models/consoles');

const upload = multer({
    dest: './public/images',
    limits: { fileSize: 1100000 },
});

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
        update: false,
    });
});

exports.createAccessory_Post = [
    upload.single('article-image'),
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
        const imageName = req.file ? req.file.filename : 'placeholder.png';
        const accessory = new Accessories({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            availableConsoles: req.body.availableConsoles,
            imageName,
        });

        if (!errors.isEmpty()) {
            res.render('accessory_form', {
                accessory,
                consoles,
                errors: errors.array(),
                update: false,
            });
        } else {
            await accessory.save();
            res.redirect('/accessories');
        }
    }),
];

exports.updateAccessory = asyncHandler(async (req, res) => {
    const [accessory, consoles] = await Promise.all([
        Accessories.findById(req.params.id).exec(),
        Consoles.find().exec(),
    ]);
    accessory.availableConsoles.forEach((availableConsole) => {
        consoles.forEach((console) => {
            if (console._id.toString() === availableConsole.toString()) {
                console.checked = true;
            }
        });
    });
    res.render('accessory_form', {
        accessory,
        consoles,
        errors: null,
        update: true,
    });
});

exports.updateAccessory_Post = [
    upload.single('article-image'),
    body('price').trim().isInt({ min: 1 }).escape(),
    body('quantity').trim().isInt({ min: 1 }).escape(),
    body('name').trim().isLength({ min: 1, max: 100 }).escape(),
    body('availableConsoles').optional().trim(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        let { imageName } = await Accessories.findById(req.params.id).exec();
        const consoles = await Consoles.find({}).exec();
        if (!req.body.availableConsoles) {
            req.body.availableConsoles = consoles.map((console) => console._id);
        }
        if (req.file) {
            await deleteImageFromFS(imageName);
            imageName = req.file.filename;
        }
        const accessory = new Accessories({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            imageName,
            availableConsoles: req.body.availableConsoles,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render('accessory_form', {
                accessory,
                consoles,
                errors: errors.array(),
                update: true,
            });
        } else {
            await Accessories.findByIdAndUpdate(req.params.id, accessory, {});
            res.redirect('/accessories');
        }
    }),
];

exports.deleteAccessory = asyncHandler(async (req, res) => {
    const { imageName } = await Accessories.findById(req.params.id).exec();
    await Promise.all([
        Accessories.findByIdAndRemove(req.params.id),
        deleteImageFromFS(imageName),
    ]);
    res.redirect('/accessories');
});
