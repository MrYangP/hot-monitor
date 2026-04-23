const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Hotspot = require('./Hotspot');

const Favorite = sequelize.define('Favorite', {
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
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'favorites',
  timestamps: false
});

// 关联关系
User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });
Hotspot.hasMany(Favorite, { foreignKey: 'hotspot_id' });
Favorite.belongsTo(Hotspot, { foreignKey: 'hotspot_id' });

module.exports = Favorite;