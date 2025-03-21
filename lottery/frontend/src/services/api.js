const API_URL = 'https://api.lottery.toolmist.com/api';

// 抽奖活动相关API
export const lotteryAPI = {
  // 获取所有抽奖活动
  getAllLotteries: async () => {
    try {
      console.log(`发起请求: ${API_URL}/lotteries`); // 调试日志
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

  // 获取单个抽奖活动详情
  getLotteryById: async (id) => {
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

  // 获取当前抽奖活动（获取第一个开放的抽奖）
  getCurrentLottery: async () => {
    try {
      const response = await fetch(`${API_URL}/lotteries/current`);
      if (!response.ok) {
        throw new Error('获取当前抽奖失败');
      }
      return await response.json();
    } catch (error) {
      console.error('获取当前抽奖错误:', error);
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
        const errorData = await response.json();
        console.error('创建抽奖错误响应:', errorData);
        throw new Error(errorData.message || '创建抽奖失败');
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
  
  // 参与抽奖
  joinLottery: async (lotteryId, participantData) => {
    try {
      const response = await fetch(`${API_URL}/lotteries/${lotteryId}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participantData),
      });
      if (!response.ok) {
        throw new Error('参与抽奖失败');
      }
      return await response.json();
    } catch (error) {
      console.error('参与抽奖错误:', error);
      throw error;
    }
  },

  // 执行抽奖（旧方法，已弃用）
  drawLottery: async (id, drawConfig = {}) => {
    try {
      console.warn('使用已弃用的drawLottery方法，请迁移到generateAndSaveLotteryNumber');
      const response = await fetch(`${API_URL}/lotteries/${id}/draw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drawConfig),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '抽奖失败');
      }

      return await response.json();
    } catch (error) {
      console.error('抽奖错误:', error);
      throw error;
    }
  },

  // 获取随机数但不保存抽奖结果（用于动画显示，已弃用）
  generateLotteryNumber: async (id, config = {}) => {
    try {
      console.warn('使用已弃用的generateLotteryNumber方法，请迁移到generateAndSaveLotteryNumber');
      const response = await fetch(`${API_URL}/lotteries/${id}/generateNumber`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '获取随机数失败');
      }

      return await response.json();
    } catch (error) {
      console.error('获取随机数错误:', error);
      throw error;
    }
  },
  
  // 生成随机数并立即保存结果（新方法）
  generateAndSaveLotteryNumber: async (id, config = {}) => {
    try {
      const response = await fetch(`${API_URL}/lotteries/${id}/generateAndSave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '抽奖失败');
      }

      return await response.json();
    } catch (error) {
      console.error('抽奖错误:', error);
      throw error;
    }
  },

  // 删除抽奖活动
  deleteLottery: async (id) => {
    try {
      const response = await fetch(`${API_URL}/lotteries/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('删除抽奖失败');
      }
      
      return await response.json();
    } catch (error) {
      console.error('删除抽奖错误:', error);
      throw error;
    }
  },
};

// 新增处理图片上传的API
export const imageAPI = {
  // 上传图片
  uploadImage: async (file) => {
    try {
      // 创建FormData对象来包含文件
      const formData = new FormData();
      formData.append('image', file);
      
      // 使用fetch API上传图片
      const response = await fetch(`${API_URL}/images/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('图片上传失败');
      }
      
      return await response.json();
    } catch (error) {
      console.error('图片上传错误:', error);
      throw error;
    }
  },
}; 