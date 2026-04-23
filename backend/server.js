const express = require('express');
const cors = require('cors');
const winston = require('winston');

// 配置日志
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// 初始化数据库模型
require('./models');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.get('/', (req, res) => {
  res.json({ message: '热点监控工具后端服务' });
});

// API路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/keywords', require('./routes/keywords'));
app.use('/api/hotspots', require('./routes/hotspots'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/config', require('./routes/config'));

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error(err.message, err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`服务器运行在 http://localhost:${PORT}`);
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;