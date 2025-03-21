const express = require('express');
const appController = require('./appController');

const router = express.Router();

// 获取所有应用信息
router.get('/apps', appController.getAllApps);

// 获取特定应用
router.get('/apps/:id', appController.getAppById);

module.exports = router;
