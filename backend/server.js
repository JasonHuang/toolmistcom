const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

// 导入路由
const lotteryRoutes = require('./src/routes/lotteryRoutes');
const imageRoutes = require('./src/routes/imageRoutes');

// 创建Express应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 连接MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// 路由
app.get('/', (req, res) => {
  res.send('抽奖应用API正在运行');
});

// API路由
app.use('/api/lotteries', lotteryRoutes);
app.use('/api/images', imageRoutes);

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 