const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multerPhotoVideo');
const AdminDashController = require('../../controller/admin/AdminDash.controller');
const AdminsOnly = require('../../middleware/AdminOnly');

// /api/admin/coaches/${coachId}/status
router.get('/coaches', AdminDashController.allCoaches);
router.get('/coaches/:id/status',AdminDashController.blockCoach)
router.post('/coaches/update/:id',AdminDashController.updateCoach)
router.post('/coaches/add',AdminDashController.addCoach)

router.get('/clients',AdminDashController.allClients)
router.post('/clients',AdminDashController.addClient)
router.get('/clients/:id/status',AdminDashController.blockClient)
router.post('/clients/update/:id',AdminDashController.updateClient)

router.get('/packages',AdminDashController.allPackages)
router.post('/packages/add',AdminDashController.addPackage)
router.post('/packages/update/:id',AdminDashController.updatePackage)
router.get('/packages/inactive/:id',AdminDashController.blockPackage)


router.get('/library',AdminDashController.allWorkouts)
router.post('/library/add-update',AdminsOnly, upload.single('mediaFile'), AdminDashController.addUpdateWorkout)
router.get('/library/:id', AdminDashController.getWorkoutById)
router.get('/library/:id/block', AdminDashController.deleteWorkout)



router.get('/enquiries', AdminDashController.allEnquiries);
router.post('/enquiries/add', AdminDashController.addEnquiry);
router.post('/enquiries/update', AdminDashController.markEnquiryAsContacted);
router.post('/enquiries/delete', AdminDashController.deleteEnquiry);

router.get('/categories',AdminsOnly, AdminDashController.allCategories);
router.post('/categories',AdminsOnly, AdminDashController.addOrUpdateCategory);


router.post('/recipes',AdminsOnly, AdminDashController.addUpdateDeleteRecipe)
router.get('/recipes',AdminsOnly,AdminDashController.allRecipes)
router.get('/recipes/:id',AdminsOnly,AdminDashController.getRecipeById)


// router.get('/transactions',AdminDashController.allTransactionsByFillter)

module.exports = router