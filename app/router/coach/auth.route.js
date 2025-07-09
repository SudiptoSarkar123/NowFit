const express = require('express');
const router = express.Router();

const AuthController = require('../../controller/coach/auth.controller');
const StaticController = require('../../controller/coach/static.controller');
const CoachOnly = require('../../middleware/CoschOnly');


router.get('/login', StaticController.loginPg);
router.get('/change-password',CoachOnly,StaticController.changePasswordPg);
router.get('/onboarding',CoachOnly,StaticController.onboardingPg);


router.post('/login', AuthController.login);
router.post('/set-password',CoachOnly,AuthController.changePassword);
router.post('/onboarding/update-profile',CoachOnly,AuthController.updateProfile);
router.post('/onboarding/add-client',CoachOnly,AuthController.addFirstClient);


router.get('/logout', CoachOnly, AuthController.logout)


module.exports = router;