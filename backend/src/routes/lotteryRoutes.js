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

// 获取当前抽奖活动（第一个进行中的抽奖）
router.get('/current', async (req, res) => {
  try {
    // 查找第一个状态为"开放"的抽奖活动
    const currentLottery = await Lottery.findOne({ isOpen: true }).sort({ createdAt: -1 });
    
    if (!currentLottery) {
      return res.status(404).json({ message: '当前没有进行中的抽奖活动' });
    }
    
    res.json(currentLottery);
  } catch (error) {
    console.error('获取当前抽奖活动出错:', error);
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
    
    // 设置排除的数字
    if (req.body.excludedNumbers && Array.isArray(req.body.excludedNumbers)) {
      // 确保所有排除的数字都是数字类型
      const validExcludedNumbers = req.body.excludedNumbers
        .map(num => parseInt(num, 10))
        .filter(num => !isNaN(num));
      
      lottery.excludedNumbers = validExcludedNumbers;
    }
    
    // 生成抽奖结果
    let result;
    
    // 如果前端传递了固定结果，则使用它
    if (req.body.fixedResult !== undefined && req.body.fixedResult !== null) {
      // 确保结果是字符串，并且不超过2位数
      const fixedNum = parseInt(req.body.fixedResult, 10);
      if (!isNaN(fixedNum)) {
        result = fixedNum.toString().padStart(2, '0');
        console.log(`使用固定结果: ${result}`);
      } else {
        // 如果传递的不是有效数字，生成随机结果
        result = generateRandomResult(lottery.excludedNumbers);
        console.log(`传递了无效结果，生成随机结果: ${result}`);
      }
    } else {
      // 生成随机结果
      result = generateRandomResult(lottery.excludedNumbers);
      console.log(`生成随机结果: ${result}`);
    }
    
    // 更新抽奖信息
    lottery.isOpen = false;
    lottery.result = result;
    lottery.winner = winner.name;
    
    const updatedLottery = await lottery.save();
    res.json(updatedLottery);
  } catch (error) {
    console.error('抽奖出错:', error);
    res.status(400).json({ message: error.message });
  }
});

// 辅助函数：生成随机结果
function generateRandomResult(excludedNumbers = []) {
  let result;
  let attempts = 0;
  const maxAttempts = 100; // 防止无限循环
  
  do {
    result = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    attempts++;
    
    // 确保不会无限循环
    if (attempts >= maxAttempts) {
      console.warn('尝试生成随机数超过最大次数，使用最后一个生成的结果');
      break;
    }
  } while (excludedNumbers.includes(parseInt(result, 10)));
  
  return result;
}

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