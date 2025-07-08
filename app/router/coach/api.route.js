const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multerPhotoVideo');
const CoachOnly = require('../../middleware/CoschOnly');
const ApiController = require('../../controller/coach/api.controller');


router.get('/clients', CoachOnly, ApiController.allClientsForTheCoach)
router.post('/clients/add', CoachOnly, ApiController.addMyClient)
// router.get('/clients/:id/status', CoachOnly,StaticController.blockClient)
// router.post('/clients/update/:id', CoachOnly,StaticController.updateClient


router.get('/categories', CoachOnly, ApiController.allCategoriesForTheCoach)
router.post('/categories/addOrUpdate', CoachOnly, ApiController.addOrUpdateCategory)
router.post('/categories/delete', CoachOnly, ApiController.deleteCategory)


router.get('/workouts', CoachOnly, ApiController.allWorkoutsForTheCoach)
router.post('/workouts/add-update', CoachOnly, upload.single('mediaFile'), ApiController.addUpdateWorkout)


router.get('/recipes', CoachOnly, ApiController.allRecipesForTheCoach)
router.post('/recipes', CoachOnly, ApiController.addUpdateDeleteRecipe)
router.get('/recipes/:id', CoachOnly, ApiController.getRecipeById)

router.post('/workout-programs', CoachOnly, ApiController.addProgram)
router.get('/workout-programs', CoachOnly, ApiController.allProgramsByCoach)
// router.get('/programs/:id',CoachOnly,ApiController.getProgramById)
// router.post('/programs/update/:id',CoachOnly,ApiController.updateProgram)
// router.post('/programs/delete/:id',CoachOnly,ApiController.deleteProgram)

router.post('/meal-plans', CoachOnly, ApiController.addMealPlan)
router.get('/meal-plans', CoachOnly, ApiController.allMealPlanByCoach)

// /coach/clients/${clientId}/assignments
router.get('/clients/:id/assignments', CoachOnly, ApiController.allAssignedClientsByCoach)
// url: `/coach/clients/${selectedClientId}/${endpoint}`,
router.post('/clients/:id/:endpoint', CoachOnly, ApiController.assignProgramToClient)


    module.exports = router;