const express = require('express');
const accessoriesController = require('../controllers/accessoriesController');

const router = express.Router();

router.get('/accessories', accessoriesController.getAccessories);
router.get('/accessories/create', accessoriesController.createAccessory);
router.post('/accessories/create', accessoriesController.createAccessory_Post);
router.get('/accessories/:id', accessoriesController.getAccessoryDetails);

module.exports = router;
