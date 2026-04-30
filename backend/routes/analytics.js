const express = require('express');
const router = express.Router();
const { getOverview, getDaily, getCategories } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/overview', getOverview);
router.get('/daily', getDaily);
router.get('/categories', getCategories);

module.exports = router;
