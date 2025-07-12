const express = require('express');
const router = express.Router();

const StaticController = require('../../controller/client/static.controller');
const ClientOnly = require('../../middleware/ClientOnly');

router.get('/dashboard',ClientOnly,StaticController.clientDashboardPg)


module.exports = router;