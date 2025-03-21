const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./src/routes');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api', routes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ToolMist主页API运行正常' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`主页后端服务运行在端口: ${PORT}`);
});
