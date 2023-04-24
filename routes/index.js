const express = require('express');
const asyncHandler = require('express-async-handler');
const Consoles = require('../models/consoles');
const Games = require('../models/games');
const Accessories = require('../models/accessories');

const router = express.Router();

router.get(
    '/',
    asyncHandler(async (req, res) => {
        const [consolesCount, gamesCount, accessoriesCount] = await Promise.all(
            [
                Consoles.countDocuments().exec(),
                Games.countDocuments().exec(),
                Accessories.countDocuments().exec(),
            ]
        );
        res.render('index', { consolesCount, gamesCount, accessoriesCount });
    })
);

module.exports = router;
