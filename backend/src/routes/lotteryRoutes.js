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
  try {
    console.log('Received lottery creation request:', req.body);

    // 验证日期格式
    const { startDate, endDate, drawDate } = req.body;
    
    // 尝试解析日期
    const parseDate = (dateStr) => {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date.toISOString().split('T')[0];
    };

    const formattedStartDate = parseDate(startDate);
    const formattedEndDate = parseDate(endDate);
    const formattedDrawDate = parseDate(drawDate);

    if (!formattedStartDate || !formattedEndDate || !formattedDrawDate) {
      console.error('Invalid date format:', { startDate, endDate, drawDate });
      return res.status(400).json({ 
        message: '日期格式无效',
        details: {
          startDate: formattedStartDate ? 'valid' : 'invalid',
          endDate: formattedEndDate ? 'valid' : 'invalid',
          drawDate: formattedDrawDate ? 'valid' : 'invalid'
        }
      });
    }

    // 创建新的抽奖实例，使用格式化后的日期
    const lotteryData = {
      ...req.body,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      drawDate: formattedDrawDate
    };

    console.log('Formatted lottery data:', lotteryData);
    const lottery = new Lottery(lotteryData);
    console.log('Created lottery instance:', lottery);

    // 保存抽奖
    const savedLottery = await lottery.save();
    console.log('Saved lottery:', savedLottery);

    res.status(201).json(savedLottery);
  } catch (error) {
    console.error('Error creating lottery:', error);
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
    
    if (!lottery.isOpen) {
      return res.status(400).json({ message: '该抽奖活动已经结束' });
    }
    
    // 设置排除的数字
    if (req.body.excludedNumbers && Array.isArray(req.body.excludedNumbers)) {
      // 确保所有排除的数字都是字符串类型
      const validExcludedNumbers = req.body.excludedNumbers
        .map(num => num.toString())
        .filter(num => num.trim() !== '');
      
      lottery.excludedNumbers = validExcludedNumbers;
    }
    
    // 处理自定义范围
    let startNumber = "1";
    let endNumber = "99";
    
    if (req.body.startNumber !== undefined) {
      startNumber = req.body.startNumber.toString();
      // 保存到模型中
      lottery.startNumber = startNumber;
    }
    
    if (req.body.endNumber !== undefined) {
      endNumber = req.body.endNumber.toString();
      // 保存到模型中
      lottery.endNumber = endNumber;
    }
    
    // 解析为整数用于生成随机结果
    const startNum = parseInt(startNumber, 10);
    const endNum = parseInt(endNumber, 10);
    
    // 生成抽奖结果
    let result;
    
    // 如果前端传递了固定结果，则使用它
    if (req.body.fixedResult !== undefined && req.body.fixedResult !== null) {
      // 确保结果是字符串，并且不超过2位数
      result = req.body.fixedResult.toString().padStart(2, '0');
      console.log(`使用固定结果: ${result}`);
    } else {
      // 生成随机结果
      result = generateRandomResult(lottery.excludedNumbers, startNum, endNum);
      console.log(`生成随机结果: ${result}`);
    }
    
    // 更新抽奖信息
    lottery.isOpen = false;
    lottery.result = result;
    
    // 只有在有参与者的情况下才设置winner
    if (lottery.participants && lottery.participants.length > 0) {
      // 随机选择获胜者
      const winnerIndex = Math.floor(Math.random() * lottery.participants.length);
      const winner = lottery.participants[winnerIndex];
      lottery.winner = winner.name;
    } else {
      // 没有参与者时，将winner设为"无参与者"
      lottery.winner = "无参与者";
    }
    
    const updatedLottery = await lottery.save();
    res.json(updatedLottery);
  } catch (error) {
    console.error('抽奖出错:', error);
    res.status(400).json({ message: error.message });
  }
});

// 生成随机数并立即保存结果
router.post('/:id/generateAndSave', async (req, res) => {
  try {
    const lottery = await Lottery.findById(req.params.id);
    if (!lottery) {
      return res.status(404).json({ message: '抽奖活动不存在' });
    }
    
    if (!lottery.isOpen) {
      return res.status(400).json({ message: '该抽奖活动已经结束' });
    }
    
    // 设置排除的数字
    if (req.body.excludedNumbers && Array.isArray(req.body.excludedNumbers)) {
      // 确保所有排除的数字都是字符串类型
      const validExcludedNumbers = req.body.excludedNumbers
        .map(num => num.toString())
        .filter(num => num.trim() !== '');
      
      lottery.excludedNumbers = validExcludedNumbers;
    }
    
    // 处理自定义范围
    let startNumber = "1";
    let endNumber = "99";
    
    if (req.body.startNumber !== undefined) {
      startNumber = req.body.startNumber.toString();
      lottery.startNumber = startNumber;
    }
    
    if (req.body.endNumber !== undefined) {
      endNumber = req.body.endNumber.toString();
      lottery.endNumber = endNumber;
    }
    
    // 解析为整数用于生成随机结果
    const startNum = parseInt(startNumber, 10);
    const endNum = parseInt(endNumber, 10);
    
    // 生成随机结果
    const result = generateRandomResult(lottery.excludedNumbers, startNum, endNum);
    console.log(`生成随机结果并保存: ${result}`);
    
    // 更新抽奖信息
    lottery.isOpen = false;
    lottery.result = result;
    
    // 只有在有参与者的情况下才设置winner
    if (lottery.participants && lottery.participants.length > 0) {
      // 随机选择获胜者
      const winnerIndex = Math.floor(Math.random() * lottery.participants.length);
      const winner = lottery.participants[winnerIndex];
      lottery.winner = winner.name;
    } else {
      // 没有参与者时，将winner设为"无参与者"
      lottery.winner = "无参与者";
    }
    
    const updatedLottery = await lottery.save();
    res.json({ 
      success: true, 
      result: result,
      lottery: updatedLottery
    });
  } catch (error) {
    console.error('抽奖出错:', error);
    res.status(400).json({ message: error.message });
  }
});

// 辅助函数：生成随机结果
function generateRandomResult(excludedNumbers = [], startNum = 0, endNum = 99) {
  let result;
  let attempts = 0;
  const maxAttempts = 100; // 防止无限循环
  
  do {
    // 在指定范围内生成随机数
    const randomNum = Math.floor(Math.random() * (endNum - startNum + 1)) + startNum;
    result = randomNum.toString().padStart(2, '0');
    attempts++;
    
    // 确保不会无限循环
    if (attempts >= maxAttempts) {
      console.warn('尝试生成随机数超过最大次数，使用最后一个生成的结果');
      break;
    }
  } while (excludedNumbers.includes(result));
  
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