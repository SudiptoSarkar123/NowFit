const express = require('express');
const router = express.Router();

const ApiController = require('../../controller/client/api.controller');
const StaticController = require('../../controller/client/static.controller');
const ClientOnly = require('../../middleware/ClientOnly');
const upload = require('../../middleware/multerPhotoVideo');

router.get('/dashboard-data',ClientOnly,ApiController.getDashboardData );
router.get('/login',ClientOnly,StaticController.loginPg);
router.post('/profile/update-avatar', ClientOnly, upload.single('avatar'), ApiController.updateAvatar)
router.post('/profile/update-details', ClientOnly, ApiController.updateProfileDetails)
router.get('/my-meal-plan/:id',ClientOnly,ApiController.getMyMealPlans);


module.exports = router;