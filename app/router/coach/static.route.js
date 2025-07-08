const express = require('express');
const router = express.Router();

const StaticController = require('../../controller/coach/static.controller');
const CoachOnly = require('../../middleware/CoschOnly');

router.get('/dashboard',CoachOnly,StaticController.dashboardPg)
router.get('/client-management',CoachOnly,StaticController.clientMgtPg)
router.get('/category-management',CoachOnly,StaticController.categoryMgtPg)
router.get('/workout-library',CoachOnly,StaticController.workoutMgtPg)
router.get('/recipe-management',CoachOnly,StaticController.recipeMgtPg)
router.get('/create-program',CoachOnly,StaticController.createProgramPg)
router.get('/assign-program',CoachOnly,StaticController.assignProgramPg)
router.get('/create-mealPlan',CoachOnly,StaticController.createMealPlanPg)



module.exports = router;