const express = require('express');
const router = express.Router();

const StaticController = require('../../controller/admin/staticController');
const AdminsOnly = require('../../middleware/AdminOnly');

router.get('/dashboard',AdminsOnly,StaticController.adminDashboardPg)
router.get('/trainer-management',AdminsOnly,StaticController.coachMgtPg)

router.get('/client-management',AdminsOnly,StaticController.clientMgtPg)
router.get('/package-management',AdminsOnly,StaticController.packageMgtPg)


router.get('/library-management',AdminsOnly,StaticController.workoutLibraryPg)
router.get('/enquiry-management',AdminsOnly,StaticController.enquiryMgtPg)


router.get('/category-management',AdminsOnly,StaticController.categoryMgtPg)

router.get('/recipe-management',AdminsOnly,StaticController.recipeMgtPg)

router.get('/transaction-management',AdminsOnly,StaticController.transactionMgtPg)

router.get('/cms-management', AdminsOnly,StaticController.cmsMgt);



module.exports = router;