const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const auth = require('../middlewares/auth');

router.get('/', auth, configController.getConfig);
router.put('/', auth, configController.updateConfig);

module.exports = router;