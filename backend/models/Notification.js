const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Hotspot = require('./Hotspot');

const Notification = sequelize.define('Notification', {
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
  hotspot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Hotspot,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: '未读'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'notifications',
  timestamps: false
});

// 关联关系
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });
Hotspot.hasMany(Notification, { foreignKey: 'hotspot_id' });
Notification.belongsTo(Hotspot, { foreignKey: 'hotspot_id' });

module.exports = Notification;