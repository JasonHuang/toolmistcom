import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import LotteryPage from './LotteryPage';
import LotteryList from './LotteryList';
import LotteryHistoryDetail from './LotteryHistoryDetail';
import { lotteryAPI } from '../services/api';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 1rem;
`;

const Tab = styled.div`
  padding: 1rem 2rem;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  flex: 1;
  transition: all 0.3s ease;
  position: relative;
  color: ${props => props.active ? '#ff4d4f' : '#666'};
  background-color: ${props => props.active ? 'rgba(255, 77, 79, 0.05)' : 'white'};
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(255, 77, 79, 0.05)' : '#f9f9f9'};
    color: ${props => props.active ? '#ff4d4f' : '#333'};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${props => props.active ? 'linear-gradient(to right, #ff4d4f, #ff7875)' : 'transparent'};
    transition: all 0.3s ease;
  }
`;

const MainContainer = ({ showDetails, defaultTab = 'create' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // 处理从其他页面传递过来的tab状态
  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [location.state, defaultTab]);

  // 确保处理URL "/lottery" 路径时显示列表
  useEffect(() => {
    if (location.pathname === '/lottery' && !id && !showDetails) {
      setActiveTab('list');
    }
  }, [location.pathname, id, showDetails]);
  
  // 检查是否需要显示详情页（从URL参数或传入属性）
  useEffect(() => {
    if (showDetails && id) {
      setActiveTab('list');
      // 防止在返回后又立即加载详情
      if (!selectedRecord || selectedRecord._id !== id) {
        // 从API获取抽奖记录
        lotteryAPI.getLotteryById(id)
          .then(data => {
            setSelectedRecord(data);
          })
          .catch(err => {
            console.error('获取抽奖详情失败:', err);
            // 出错时重定向到列表页
            navigate('/lottery', { replace: true });
          });
      }
    } else {
      // 如果URL不包含id参数，确保清空选中记录
      if (selectedRecord) {
        setSelectedRecord(null);
      }
    }
  }, [showDetails, id]);  // 故意移除selectedRecord依赖，防止循环
  
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    // 切换标签时重置详情视图
    setSelectedRecord(null);
    
    // 如果点击的是创建标签，导航到创建页面
    if (tabName === 'create') {
      navigate('/lottery/create', { replace: true });
    } 
    // 如果点击的是列表标签，导航到列表页面
    else if (tabName === 'list') {
      navigate('/lottery', { replace: true });
    }
  };
  
  const handleRecordSelect = (record) => {
    if (record) {
      setSelectedRecord(record);
      // 更新URL以反映选择的记录
      navigate(`/lottery/${record._id}`);
    }
  };
  
  const handleBack = () => {
    // 立即清空选中记录
    setSelectedRecord(null);
    // 导航到列表页
    navigate('/lottery', { replace: true });
  };
  
  return (
    <Container>
      <TabContainer>
        <Tab
          active={activeTab === 'create'}
          onClick={() => handleTabClick('create')}
        >
          创建抽奖
        </Tab>
        <Tab
          active={activeTab === 'list'}
          onClick={() => handleTabClick('list')}
        >
          抽奖列表
        </Tab>
      </TabContainer>
      
      {activeTab === 'create' && !selectedRecord && <LotteryPage />}
      
      {activeTab === 'list' && !selectedRecord && (
        <LotteryList onRecordSelect={handleRecordSelect} />
      )}
      
      {selectedRecord && (
        <LotteryHistoryDetail record={selectedRecord} onBack={handleBack} />
      )}
    </Container>
  );
};

export default MainContainer; 