/**
 * Routes for Administration pages.
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.use(isAuthenticated);

router.get('/dashboard', adminController.dashboard);

router.get('/feeds', adminController.feeds);
router.post('/feeds', adminController.createFeed);
router.get('/feeds/delete/:id', adminController.deleteFeed);

router.get('/settings', adminController.settings);
router.post('/settings', adminController.updateSettings);
router.post('/settings/reset', adminController.resetSettings);

router.get('/drafts', adminController.drafts);
router.get('/drafts/delete/:id', adminController.deleteDraft);

module.exports = router;
