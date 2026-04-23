const { CollectionConfig } = require('../models');

// 获取用户配置
const getConfig = async (req, res) => {
  try {
    const config = await CollectionConfig.findOne({ where: { user_id: req.user.id } });
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: '获取配置失败' });
  }
};

// 更新用户配置
const updateConfig = async (req, res) => {
  try {
    const { frequency, sources } = req.body;

    let config = await CollectionConfig.findOne({ where: { user_id: req.user.id } });

    if (config) {
      // 更新现有配置
      await config.update({
        frequency: frequency || config.frequency,
        sources: sources || config.sources
      });
    } else {
      // 创建新配置
      config = await CollectionConfig.create({
        user_id: req.user.id,
        frequency: frequency || '每小时',
        sources: sources || JSON.stringify(['百度', '必应', 'Twitter', 'B站', '知乎', 'DuckDuckGo', 'HackerNews', 'Google'])
      });
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({ message: '更新配置失败' });
  }
};

module.exports = {
  getConfig,
  updateConfig
};