const express = require('express');
const router = express.Router();
const keywordController = require('../controllers/keywordController');
const auth = require('../middlewares/auth');

router.get('/', auth, keywordController.getKeywords);
router.post('/', auth, keywordController.addKeyword);
router.put('/:id', auth, keywordController.updateKeyword);
router.delete('/:id', auth, keywordController.deleteKeyword);
router.post('/scan', auth, keywordController.scanKeywords);

module.exports = router;