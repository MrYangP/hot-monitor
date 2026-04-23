const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Keyword = sequelize.define('Keyword', {
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
  keyword: {
    type: DataTypes.STRING,
    allowNull: false
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 2
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  tableName: 'keywords',
  timestamps: false
});

// 关联关系
User.hasMany(Keyword, { foreignKey: 'user_id' });
Keyword.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Keyword;