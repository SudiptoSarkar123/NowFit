const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multerPhotoVideo');
const CoachOnly = require('../../middleware/CoschOnly');
const ApiController = require('../../controller/coach/api.controller');


router.get('/clients', CoachOnly, ApiController.allClientsForTheCoach)
router.post('/clients/add', CoachOnly, ApiController.addMyClient)
router.get('/client/:id', CoachOnly, ApiController.getClientById)
router.post('/clients/:clientId/unassign-meal-plan',CoachOnly,ApiController.unassignMealPlan)
router.post('/clients/:clientId/unassign-workout',CoachOnly,ApiController.unassignProgram)

router.get('/categories', CoachOnly, ApiController.allCategoriesForTheCoach)
router.post('/categories/addOrUpdate', CoachOnly, ApiController.addOrUpdateCategory)
router.post('/categories/delete', CoachOnly, ApiController.deleteCategory)


router.get('/workouts', CoachOnly, ApiController.allWorkoutsForTheCoach)
router.post('/workouts/add-update', CoachOnly, upload.single('mediaFile'), ApiController.addUpdateWorkout)


router.get('/recipes', CoachOnly, ApiController.allRecipesForTheCoach)
router.post('/recipes', CoachOnly, ApiController.addUpdateDeleteRecipe)
router.get('/recipes/:id', CoachOnly, ApiController.getRecipeById)

router.post('/workout-programs', CoachOnly, ApiController.addWorkoutProgram)
router.get('/workout-programs', CoachOnly, ApiController.allProgramsByCoach)

router.post('/meal-plans', CoachOnly, ApiController.addMealPlan)
router.get('/meal-plans', CoachOnly, ApiController.allMealPlanByCoach)

// /coach/clients/${clientId}/assignments
router.get('/clients/:clientId/assignments', CoachOnly, ApiController.allProgramsForTheClient)
// url: `/coach/clients/${selectedClientId}/${endpoint}`,
router.post('/clients/:clientId/:type', CoachOnly, ApiController.assignProgramToClient)



router.get('/habits', CoachOnly, ApiController.allHabits)
router.post('/habits', CoachOnly, ApiController.addEditHabit)
 // Fetch this specific client's assigned habits
            // $.get(`/coach/client/${clientId}/habits`, function(response) { // You need to create this route
            //     if(response.success) {







    module.exports = router;