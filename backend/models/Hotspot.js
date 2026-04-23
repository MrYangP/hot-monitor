const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Keyword = require('./Keyword');

const Hotspot = sequelize.define('Hotspot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hot_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  relevance: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  keyword_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Keyword,
      key: 'id'
    }
  },
  ai_score: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  importance: {
    type: DataTypes.STRING,
    defaultValue: '中'
  },
  is_filtered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  like_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  published_at: {
    type: DataTypes.DATE,
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
  tableName: 'hotspots',
  timestamps: false
});

// 关联关系
Keyword.hasMany(Hotspot, { foreignKey: 'keyword_id' });
Hotspot.belongsTo(Keyword, { foreignKey: 'keyword_id' });

module.exports = Hotspot;