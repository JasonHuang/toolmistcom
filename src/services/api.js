const API_URL = 'http://127.0.0.1:5000/api';

// 抽奖活动相关API
export const lotteryAPI = {
  // 获取所有抽奖活动
  getAllLotteries: async () => {
    try {
      console.log('发起请求: ' + `${API_URL}/lotteries`); // 调试日志
      const response = await fetch(`${API_URL}/lotteries`);
      console.log('响应状态: ', response.status, response.statusText); // 调试日志
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('响应内容: ', errorText); // 调试日志
        throw new Error(`获取抽奖列表失败: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('获取抽奖列表错误:', error);
      throw error;
    }
  },

  // 获取单个抽奖活动
  getLottery: async (id) => {
    try {
      const response = await fetch(`${API_URL}/lotteries/${id}`);
      if (!response.ok) {
        throw new Error('获取抽奖详情失败');
      }
      return await response.json();
    } catch (error) {
      console.error('获取抽奖详情错误:', error);
      throw error;
    }
  },

  // 创建新抽奖活动
  createLottery: async (lotteryData) => {
    try {
      const response = await fetch(`${API_URL}/lotteries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lotteryData),
      });
      if (!response.ok) {
        throw new Error('创建抽奖失败');
      }
      return await response.json();
    } catch (error) {
      console.error('创建抽奖错误:', error);
      throw error;
    }
  },

  // 更新抽奖活动
  updateLottery: async (id, lotteryData) => {
    try {
      const response = await fetch(`${API_URL}/lotteries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lotteryData),
      });
      if (!response.ok) {
        throw new Error('更新抽奖失败');
      }
      return await response.json();
    } catch (error) {
      console.error('更新抽奖错误:', error);
      throw error;
    }
  },

  // 添加参与者
  addParticipant: async (lotteryId, participantData) => {
    try {
      const response = await fetch(`${API_URL}/lotteries/${lotteryId}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participantData),
      });
      if (!response.ok) {
        throw new Error('添加参与者失败');
      }
      return await response.json();
    } catch (error) {
      console.error('添加参与者错误:', error);
      throw error;
    }
  },

  // 执行抽奖
  drawLottery: async (lotteryId, options = {}) => {
    try {
      const response = await fetch(`${API_URL}/lotteries/${lotteryId}/draw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          excludedNumbers: options.excludedNumbers || [],
          fixedResult: options.fixedResult || null
        }),
      });
      if (!response.ok) {
        throw new Error('执行抽奖失败');
      }
      return await response.json();
    } catch (error) {
      console.error('执行抽奖错误:', error);
      throw error;
    }
  }
}; 