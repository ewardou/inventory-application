const asyncHandler = require('express-async-handler');
const Consoles = require('../models/consoles');

exports.getConsoles = asyncHandler(async (req, res, next) => {
    const allConsoles = await Consoles.find().exec();
    res.render('consoles', { allConsoles, title: 'Available Consoles' });
});
