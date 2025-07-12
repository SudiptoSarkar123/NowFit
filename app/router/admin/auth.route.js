const express = require('express');
const router = express.Router();

const AuthController = require('../../controller/admin/AuthController');
const StaticController = require('../../controller/admin/staticController');


router.get('/login', StaticController.loginPg);

router.post('/login', AuthController.login);
router.get('/logout',AuthController.logout)



module.exports = router;