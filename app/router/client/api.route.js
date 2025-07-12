const express = require('express');
const router = express.Router();

const ApiController = require('../../controller/client/api.controller');
const StaticController = require('../../controller/client/static.controller');
const ClientOnly = require('../../middleware/ClientOnly');

router.get('/dashboard-data',ClientOnly,ApiController.getDashboardData );
router.get('/login',ClientOnly,StaticController.loginPg);


module.exports = router;