const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const CollectionConfig = sequelize.define('CollectionConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  frequency: {
    type: DataTypes.STRING,
    defaultValue: '每小时'
  },
  sources: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'collection_configs',
  timestamps: false
});

// 关联关系
User.hasOne(CollectionConfig, { foreignKey: 'user_id' });
CollectionConfig.belongsTo(User, { foreignKey: 'user_id' });

module.exports = CollectionConfig;