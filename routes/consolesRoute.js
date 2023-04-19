const express = require('express');
const consolesController = require('../controllers/consolesController');

const router = express.Router();

router.get('/consoles', consolesController.getConsoles);
router.get('/consoles/create', consolesController.createConsole);
router.post('/consoles/create', consolesController.createConsole_Post);
router.get('/consoles/:id', consolesController.getConsoleDetails);
router.get('/consoles/:id/update', consolesController.updateConsole);
router.post('/consoles/:id/update', consolesController.updateConsole_Post);
router.post('/consoles/:id/delete', consolesController.deleteConsole);

module.exports = router;
