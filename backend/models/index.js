const sequelize = require('../config/database');
const User = require('./User');
const Keyword = require('./Keyword');
const Hotspot = require('./Hotspot');
const Notification = require('./Notification');
const CollectionConfig = require('./CollectionConfig');
const Favorite = require('./Favorite');

// 同步数据库表结构
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('数据库表结构同步成功');
  } catch (error) {
    console.error('数据库表结构同步失败:', error);
  }
};

syncDatabase();

module.exports = {
  sequelize,
  User,
  Keyword,
  Hotspot,
  Notification,
  CollectionConfig,
  Favorite
};