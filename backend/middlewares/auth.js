const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: '未授权' });
    }

    const decoded = jwt.verify(token, 'your-secret-key');
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: '无效的令牌' });
  }
};

module.exports = auth;