const { Hotspot, Keyword, Favorite } = require('../models');

// 获取热点列表
const getHotspots = async (req, res) => {
  try {
    // 获取用户的关键词
    const keywords = await Keyword.findAll({ where: { user_id: req.user.id } });
    const keywordIds = keywords.map(k => k.id);

    // 获取热点，并包含关键词信息
    const hotspots = await Hotspot.findAll({
      where: { keyword_id: keywordIds, is_filtered: false },
      include: [{ model: Keyword, attributes: ['keyword'] }]
    });

    // 获取用户的收藏
    const favorites = await Favorite.findAll({ where: { user_id: req.user.id } });
    const favoriteIds = favorites.map(f => f.hotspot_id);

    // 添加收藏状态
    const hotspotsWithFavorite = hotspots.map(hotspot => ({
      ...hotspot.toJSON(),
      keyword: hotspot.Keyword.keyword,
      is_favorite: favoriteIds.includes(hotspot.id)
    }));

    res.json(hotspotsWithFavorite);
  } catch (error) {
    res.status(500).json({ message: '获取热点列表失败' });
  }
};

// 获取热点概览
const getHotspotOverview = async (req, res) => {
  try {
    // 获取用户的关键词
    const keywords = await Keyword.findAll({ where: { user_id: req.user.id } });
    const keywordIds = keywords.map(k => k.id);

    // 获取总热点数
    const totalHotspots = await Hotspot.count({ where: { keyword_id: keywordIds, is_filtered: false } });

    // 获取紧急热点数
    const urgentHotspots = await Hotspot.count({ where: { keyword_id: keywordIds, is_filtered: false, importance: '紧急' } });

    // 获取收藏数
    const favoriteCount = await Favorite.count({ where: { user_id: req.user.id } });

    // 获取关键词数
    const keywordCount = keywords.length;

    res.json({
      totalHotspots,
      urgentHotspots,
      favoriteCount,
      keywordCount
    });
  } catch (error) {
    res.status(500).json({ message: '获取热点概览失败' });
  }
};

// 收藏热点
const favoriteHotspot = async (req, res) => {
  try {
    const { id } = req.params;

    // 检查热点是否存在
    const hotspot = await Hotspot.findByPk(id);
    if (!hotspot) {
      return res.status(404).json({ message: '热点不存在' });
    }

    // 检查是否已经收藏
    const existingFavorite = await Favorite.findOne({ where: { user_id: req.user.id, hotspot_id: id } });
    if (existingFavorite) {
      return res.status(400).json({ message: '已经收藏过了' });
    }

    // 添加收藏
    await Favorite.create({
      user_id: req.user.id,
      hotspot_id: id
    });

    res.json({ message: '收藏成功' });
  } catch (error) {
    res.status(500).json({ message: '收藏失败' });
  }
};

// 取消收藏热点
const unfavoriteHotspot = async (req, res) => {
  try {
    const { id } = req.params;

    // 检查是否已经收藏
    const existingFavorite = await Favorite.findOne({ where: { user_id: req.user.id, hotspot_id: id } });
    if (!existingFavorite) {
      return res.status(400).json({ message: '还没有收藏' });
    }

    // 取消收藏
    await existingFavorite.destroy();

    res.json({ message: '取消收藏成功' });
  } catch (error) {
    res.status(500).json({ message: '取消收藏失败' });
  }
};

module.exports = {
  getHotspots,
  getHotspotOverview,
  favoriteHotspot,
  unfavoriteHotspot
};