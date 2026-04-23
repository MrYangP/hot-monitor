const express = require('express');
const router = express.Router();
const hotspotController = require('../controllers/hotspotController');
const auth = require('../middlewares/auth');

router.get('/', auth, hotspotController.getHotspots);
router.get('/overview', auth, hotspotController.getHotspotOverview);
router.post('/:id/favorite', auth, hotspotController.favoriteHotspot);
router.delete('/:id/favorite', auth, hotspotController.unfavoriteHotspot);

module.exports = router;