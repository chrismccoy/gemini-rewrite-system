/**
 * All routes in this file are protected by authentication.
 */

const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.use(isAuthenticated);

router.post('/rewrite', apiController.rewriteAndDraft);

module.exports = router;
