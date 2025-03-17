import React, { useState } from 'react';
import styled from 'styled-components';
import LotteryPage from './LotteryPage';
import LotteryHistory from './LotteryHistory';
import LotteryHistoryDetail from './LotteryHistoryDetail';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #f5f5f5;
`;

const TabContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: white;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: -32px;
`;

const Tab = styled.div`
  padding: 15px 30px;
  cursor: pointer;
  font-size: 16px;
  color: ${props => props.active ? '#1890ff' : '#666'};
  border-bottom: 2px solid ${props => props.active ? '#1890ff' : 'transparent'};
  transition: all 0.3s ease;
  margin: 0 10px;

  &:hover {
    color: #1890ff;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  flex: 1;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  padding: 20px 0;
`;

const MainContainer = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleRecordSelect = (record) => {
    setSelectedRecord(record);
  };

  const handleBack = () => {
    setSelectedRecord(null);
  };

  return (
    <Container>
      <TabContainer>
        <Tab 
          active={activeTab === 'current'} 
          onClick={() => {
            setActiveTab('current');
            setSelectedRecord(null);
          }}
        >
          当前抽奖
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => {
            setActiveTab('history');
            setSelectedRecord(null);
          }}
        >
          历届抽奖
        </Tab>
      </TabContainer>
      <ContentContainer>
        {activeTab === 'current' && <LotteryPage />}
        {activeTab === 'history' && !selectedRecord && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <LotteryHistory onRecordSelect={handleRecordSelect} />
          </div>
        )}
        {activeTab === 'history' && selectedRecord && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <LotteryHistoryDetail record={selectedRecord} onBack={handleBack} />
          </div>
        )}
      </ContentContainer>
    </Container>
  );
};

export default MainContainer; 