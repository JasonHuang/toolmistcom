# 抽奖应用后端

这是一个基于 Node.js, Express, 和 MongoDB 的抽奖应用后端服务。

## 功能

- 创建和管理抽奖活动
- 参与者登记
- 随机抽奖和结果生成
- 历史记录查询

## 开发环境设置

### 前提条件

- Node.js (v12+)
- MongoDB (本地或远程)

### 安装

1. 安装依赖

```bash
npm install
```

2. 创建 `.env` 文件并设置环境变量

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lottery-app
NODE_ENV=development
```

### 运行

开发模式（自动重启）:

```bash
npm run dev
```

生产模式:

```bash
npm start
```

## API 端点

### 抽奖活动

- `GET /api/lotteries` - 获取所有抽奖活动
- `GET /api/lotteries/:id` - 获取单个抽奖活动
- `POST /api/lotteries` - 创建新的抽奖活动
- `PATCH /api/lotteries/:id` - 更新抽奖活动
- `DELETE /api/lotteries/:id` - 删除抽奖活动

### 参与者

- `POST /api/lotteries/:id/participants` - 添加新参与者

### 抽奖

- `POST /api/lotteries/:id/draw` - 进行抽奖

## 数据模型

### 抽奖活动 (Lottery)

- `title` - 活动标题
- `description` - 活动描述
- `startDate` - 开始日期
- `endDate` - 结束日期
- `drawDate` - 抽奖日期
- `prize` - 奖品
- `maxParticipants` - 最大参与人数
- `participants` - 参与者列表
- `isOpen` - 活动是否开放
- `result` - 抽奖结果
- `winner` - 获奖者
- `excludedNumbers` - 排除的数字 