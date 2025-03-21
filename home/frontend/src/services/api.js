import axios from 'axios';

// 开发环境API地址
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api' 
  : 'https://home.toolmist.com/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里添加认证令牌等
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
);

// API方法
export const appAPI = {
  // 获取所有应用
  getAllApps: () => api.get('/apps'),
  
  // 获取应用详情
  getAppById: (id) => api.get(`/apps/${id}`)
};

export default api;
