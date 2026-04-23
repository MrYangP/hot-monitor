const { Keyword } = require('../models');

// 获取用户关键词列表
const getKeywords = async (req, res) => {
  try {
    const keywords = await Keyword.findAll({ where: { user_id: req.user.id } });
    res.json(keywords);
  } catch (error) {
    res.status(500).json({ message: '获取关键词列表失败' });
  }
};

// 添加关键词
const addKeyword = async (req, res) => {
  try {
    const { keyword, priority = 2, status = true } = req.body;

    const newKeyword = await Keyword.create({
      user_id: req.user.id,
      keyword,
      priority,
      status
    });

    res.status(201).json(newKeyword);
  } catch (error) {
    res.status(500).json({ message: '添加关键词失败' });
  }
};

// 更新关键词
const updateKeyword = async (req, res) => {
  try {
    const { id } = req.params;
    const { keyword, priority, status } = req.body;

    const existingKeyword = await Keyword.findOne({ where: { id, user_id: req.user.id } });
    if (!existingKeyword) {
      return res.status(404).json({ message: '关键词不存在' });
    }

    await existingKeyword.update({
      keyword: keyword || existingKeyword.keyword,
      priority: priority !== undefined ? priority : existingKeyword.priority,
      status: status !== undefined ? status : existingKeyword.status
    });

    res.json(existingKeyword);
  } catch (error) {
    res.status(500).json({ message: '更新关键词失败' });
  }
};

// 删除关键词
const deleteKeyword = async (req, res) => {
  try {
    const { id } = req.params;

    const existingKeyword = await Keyword.findOne({ where: { id, user_id: req.user.id } });
    if (!existingKeyword) {
      return res.status(404).json({ message: '关键词不存在' });
    }

    await existingKeyword.destroy();
    res.json({ message: '关键词删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除关键词失败' });
  }
};

// 立即扫描关键词
const scanKeywords = async (req, res) => {
  try {
    // 这里应该实现扫描逻辑
    // 1. 获取用户的所有关键词
    // 2. 调用外部API搜集数据
    // 3. 调用AI服务进行分析
    // 4. 存储热点数据
    // 5. 发送通知

    res.json({ message: '扫描任务已启动' });
  } catch (error) {
    res.status(500).json({ message: '扫描失败' });
  }
};

module.exports = {
  getKeywords,
  addKeyword,
  updateKeyword,
  deleteKeyword,
  scanKeywords
};