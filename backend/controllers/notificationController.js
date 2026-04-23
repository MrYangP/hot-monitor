const { Notification } = require('../models');

// 获取通知列表
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({ 
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: '获取通知列表失败' });
  }
};

// 标记通知为已读
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({ where: { id, user_id: req.user.id } });
    if (!notification) {
      return res.status(404).json({ message: '通知不存在' });
    }

    await notification.update({ status: '已读' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: '标记通知失败' });
  }
};

// 清除通知
const clearNotifications = async (req, res) => {
  try {
    await Notification.destroy({ where: { user_id: req.user.id } });
    res.json({ message: '通知已清除' });
  } catch (error) {
    res.status(500).json({ message: '清除通知失败' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  clearNotifications
};