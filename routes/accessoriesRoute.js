const express = require('express');
const accessoriesController = require('../controllers/accessoriesController');

const router = express.Router();

router.get('/accessories', accessoriesController.getAccessories);
router.get('/accessories/create', accessoriesController.createAccessory);
router.post('/accessories/create', accessoriesController.createAccessory_Post);
router.get('/accessories/:id', accessoriesController.getAccessoryDetails);
router.get('/accessories/:id/update', accessoriesController.updateAccessory);
router.post(
    '/accessories/:id/update',
    accessoriesController.updateAccessory_Post
);
router.post('/accessories/:id/delete', accessoriesController.deleteAccessory);

module.exports = router;
