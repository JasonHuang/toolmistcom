import React, { useState } from 'react';
import styled from 'styled-components';
import LotteryPage from './LotteryPage';
import LotteryHistory from './LotteryHistory';
import LotteryHistoryDetail from './LotteryHistoryDetail';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 2rem 1rem;
  position: relative;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 800px;
  border-radius: 8px;
  overflow: hidden;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  background-color: ${props => props.active ? '#4a90e2' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#495057'};
  border: none;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#4a90e2' : '#e9ecef'};
  }
`;

const MainContainer = () => {
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'history'
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  const handleRecordSelect = (record) => {
    setSelectedRecord(record);
  };
  
  const handleBackToList = () => {
    setSelectedRecord(null);
  };
  
  return (
    <Container>
      <TabContainer>
        <Tab 
          active={activeTab === 'current'} 
          onClick={() => setActiveTab('current')}
        >
          当前抽奖
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          历届抽奖
        </Tab>
      </TabContainer>
      
      {activeTab === 'current' && <LotteryPage />}
      
      {activeTab === 'history' && !selectedRecord && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <LotteryHistory onRecordSelect={handleRecordSelect} />
        </div>
      )}
      
      {activeTab === 'history' && selectedRecord && (
        <LotteryHistoryDetail record={selectedRecord} onBack={handleBackToList} />
      )}
    </Container>
  );
};

export default MainContainer; 