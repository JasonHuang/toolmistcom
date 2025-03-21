// 示例应用数据 (实际项目可连接数据库)
const apps = [
  {
    id: "lottery",
    title: "抽奖系统",
    description: "创建和管理在线抽奖活动，支持多种抽奖模式和自定义设置。",
    icon: "🎯",
    url: "https://lottery.toolmist.com",
    color: "#ff8303",
    isActive: true
  },
  {
    id: "gold",
    title: "黄金系统",
    description: "黄金价格追踪和交易模拟工具，提供历史数据分析和趋势预测。",
    icon: "💰",
    url: "https://gold.toolmist.com",
    color: "#ffc107",
    isActive: false
  }
];

// 获取所有应用
exports.getAllApps = (req, res) => {
  try {
    // 可选过滤只返回激活的应用
    const active = req.query.active === 'true';
    let result = apps;
    
    if (active) {
      result = apps.filter(app => app.isActive);
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取应用列表失败'
    });
  }
};

// 获取特定应用
exports.getAppById = (req, res) => {
  try {
    const { id } = req.params;
    const app = apps.find(app => app.id === id);
    
    if (!app) {
      return res.status(404).json({
        success: false,
        error: '应用不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: app
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取应用信息失败'
    });
  }
};
