const express = require('express');
const router = express.Router();

const AuthController = require('../../controller/client/auth.controller');
const StaticController = require('../../controller/client/static.controller');


router.get('/login', StaticController.loginPg);

router.post('/login', AuthController.login);
router.get('/logout',AuthController.logout)


module.exports = router;