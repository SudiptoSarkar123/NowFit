const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multerPhotoVideo');
const CoachOnly = require('../../middleware/CoschOnly');
const ApiController = require('../../controller/coach/api.controller');


router.get('/clients', CoachOnly,ApiController.allClientsForTheCoach)
router.post('/clients/add', CoachOnly,ApiController.addMyClient)
// router.get('/clients/:id/status', CoachOnly,StaticController.blockClient)
// router.post('/clients/update/:id', CoachOnly,StaticController.updateClient


router.get('/categories', CoachOnly,ApiController.allCategoriesForTheCoach)
router.post('/categories/addOrUpdate', CoachOnly,ApiController.addOrUpdateCategory)
router.post('/categories/delete', CoachOnly,ApiController.deleteCategory)


router.get('/workouts', CoachOnly,ApiController.allWorkoutsForTheCoach)
router.post('/workouts/add-update', CoachOnly,upload.single('mediaFile'),ApiController.addUpdateWorkout)

module.exports = router;