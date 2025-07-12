const PublicController = require('../../controller/public/public.controller');
const express = require('express');
const router = express.Router();

router.get('/', PublicController.publicLandingPg);


module.exports = router;