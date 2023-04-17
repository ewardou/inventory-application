const express = require('express');
const consolesController = require('../controllers/consolesController');

const router = express.Router();

router.get('/consoles', consolesController.getConsoles);

module.exports = router;
