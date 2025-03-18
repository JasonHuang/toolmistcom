const express = require('express');
const router = express.Router();
const Lottery = require('../models/Lottery');

// 获取所有抽奖活动
router.get('/', async (req, res) => {
  try {
    const lotteries = await Lottery.find().sort({ createdAt: -1 });
    res.json(lotteries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取单个抽奖活动
router.get('/:id', async (req, res) => {
  try {
    const lottery = await Lottery.findById(req.params.id);
    if (!lottery) {
      return res.status(404).json({ message: '抽奖活动不存在' });
    }
    res.json(lottery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建新的抽奖活动
router.post('/', async (req, res) => {
  const lottery = new Lottery(req.body);
  try {
    const newLottery = await lottery.save();
    res.status(201).json(newLottery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 更新抽奖活动
router.patch('/:id', async (req, res) => {
  try {
    const lottery = await Lottery.findById(req.params.id);
    if (!lottery) {
      return res.status(404).json({ message: '抽奖活动不存在' });
    }
    
    // 如果是关闭抽奖，可以设置isOpen为false
    if (req.body.isOpen === false && lottery.isOpen === true) {
      lottery.isOpen = false;
      await lottery.save();
      return res.json(lottery);
    }
    
    // 更新其他字段
    Object.keys(req.body).forEach(key => {
      lottery[key] = req.body[key];
    });
    
    const updatedLottery = await lottery.save();
    res.json(updatedLottery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 添加参与者
router.post('/:id/participants', async (req, res) => {
  try {
    const lottery = await Lottery.findById(req.params.id);
    if (!lottery) {
      return res.status(404).json({ message: '抽奖活动不存在' });
    }
    
    if (!lottery.isOpen) {
      return res.status(400).json({ message: '该抽奖活动已关闭' });
    }
    
    if (lottery.participants.length >= lottery.maxParticipants) {
      return res.status(400).json({ message: '参与人数已达上限' });
    }
    
    // 检查是否已参与
    const existingParticipant = lottery.participants.find(
      p => p.phone === req.body.phone || p.email === req.body.email
    );
    
    if (existingParticipant) {
      return res.status(400).json({ message: '您已经参与过该抽奖活动' });
    }
    
    lottery.participants.push(req.body);
    const updatedLottery = await lottery.save();
    res.status(201).json(updatedLottery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 进行抽奖
router.post('/:id/draw', async (req, res) => {
  try {
    const lottery = await Lottery.findById(req.params.id);
    if (!lottery) {
      return res.status(404).json({ message: '抽奖活动不存在' });
    }
    
    if (lottery.participants.length === 0) {
      return res.status(400).json({ message: '没有参与者，无法抽奖' });
    }
    
    if (!lottery.isOpen) {
      return res.status(400).json({ message: '该抽奖活动已经结束' });
    }
    
    // 随机选择获胜者
    const winnerIndex = Math.floor(Math.random() * lottery.participants.length);
    const winner = lottery.participants[winnerIndex];
    
    // 生成抽奖结果
    let result;
    if (req.body.excludedNumbers && req.body.excludedNumbers.length > 0) {
      lottery.excludedNumbers = req.body.excludedNumbers;
    }
    
    // 生成随机结果，如果有排除的数字，则排除
    do {
      result = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    } while (lottery.excludedNumbers.includes(result));
    
    // 更新抽奖信息
    lottery.isOpen = false;
    lottery.result = result;
    lottery.winner = winner.name;
    
    const updatedLottery = await lottery.save();
    res.json(updatedLottery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除抽奖活动
router.delete('/:id', async (req, res) => {
  try {
    const lottery = await Lottery.findById(req.params.id);
    if (!lottery) {
      return res.status(404).json({ message: '抽奖活动不存在' });
    }
    
    await Lottery.findByIdAndDelete(req.params.id);
    res.json({ message: '抽奖活动已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 