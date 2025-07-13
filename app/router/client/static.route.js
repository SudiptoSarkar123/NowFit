const express = require('express');
const router = express.Router();

const StaticController = require('../../controller/client/static.controller');
const ClientOnly = require('../../middleware/ClientOnly');

router.get('/dashboard',ClientOnly,StaticController.clientDashboardPg)
router.get('/profile',ClientOnly,StaticController.clientProfilePg)
router.get('/meal-plan/:id',ClientOnly,StaticController.clientMealPlanPg)


module.exports = router;