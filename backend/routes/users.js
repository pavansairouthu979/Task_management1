const express = require('express');
const router = express.Router();
const { updateProfile, updatePassword, updatePreferences } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.put('/profile', updateProfile);
router.put('/updatepassword', updatePassword);
router.put('/preferences', updatePreferences);

module.exports = router;
