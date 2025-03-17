import React from 'react';
import styled from 'styled-components';

const HistoryContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 14px;
`;

const THead = styled.thead`
  background-color: #f8f9fa;
`;

const Th = styled.th`
  padding: 12px 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
  color: #495057;
`;

const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #e9ecef;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f1f8ff;
  }
  cursor: pointer;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => (props.isOpen ? '#e3f2fd' : '#e8f5e9')};
  color: ${props => (props.isOpen ? '#1976d2' : '#388e3c')};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
`;

const ViewButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

// 示例数据
const MOCK_HISTORY_DATA = [
  {
    id: 1,
    date: '2023-12-01',
    title: '2023年12月幸运抽奖',
    drawDate: '2023-12-15',
    prize: 'iPhone 15 Pro',
    isOpen: false,
    winner: '张三',
    description: '年终幸运大抽奖',
    range: '1-1000',
    excluded: [13, 14, 666, 888],
    result: 777
  },
  {
    id: 2,
    date: '2024-01-10',
    title: '2024年元旦抽奖',
    drawDate: '2024-01-20',
    prize: 'PlayStation 5',
    isOpen: false,
    winner: '李四',
    description: '迎新抽奖活动',
    range: '1-500',
    excluded: [7, 13, 250],
    result: 188
  },
  {
    id: 3,
    date: '2024-02-05',
    title: '春节特别抽奖',
    drawDate: '2024-02-10',
    prize: 'MacBook Air',
    isOpen: false,
    winner: '王五',
    description: '春节喜庆抽奖',
    range: '1-888',
    excluded: [4, 13, 14, 444],
    result: 666
  },
  {
    id: 4,
    date: '2024-03-08',
    title: '三八妇女节抽奖',
    drawDate: '2024-03-15',
    prize: 'Dyson吹风机',
    isOpen: true,
    winner: '',
    description: '女神节特别活动',
    range: '1-300',
    excluded: [13, 113, 213],
    result: null
  },
  {
    id: 5,
    date: '2024-03-20',
    title: '春分抽奖活动',
    drawDate: '2024-03-25',
    prize: 'AirPods Pro',
    isOpen: true,
    winner: '',
    description: '春分时节特别活动',
    range: '50-150',
    excluded: [88, 99, 100],
    result: null
  }
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const LotteryHistory = ({ onRecordSelect }) => {
  const handleViewDetails = (record) => {
    if (onRecordSelect) {
      onRecordSelect(record);
    }
  };

  return (
    <HistoryContainer>
      <Title>历届抽奖记录</Title>
      {MOCK_HISTORY_DATA.length > 0 ? (
        <Table>
          <THead>
            <tr>
              <Th>抽奖日期</Th>
              <Th>抽奖内容</Th>
              <Th>开奖日期</Th>
              <Th>抽奖奖品</Th>
              <Th>状态</Th>
              <Th>中奖人</Th>
              <Th>操作</Th>
            </tr>
          </THead>
          <tbody>
            {MOCK_HISTORY_DATA.map((record) => (
              <Tr key={record.id} onClick={() => handleViewDetails(record)}>
                <Td>{formatDate(record.date)}</Td>
                <Td>{record.title}</Td>
                <Td>{formatDate(record.drawDate)}</Td>
                <Td>{record.prize}</Td>
                <Td>
                  <StatusBadge isOpen={record.isOpen}>
                    {record.isOpen ? '待开奖' : '已开奖'}
                  </StatusBadge>
                </Td>
                <Td>{record.isOpen ? '-' : record.winner}</Td>
                <Td>
                  <ViewButton onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(record);
                  }}>
                    查看详情
                  </ViewButton>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyMessage>暂无抽奖记录</EmptyMessage>
      )}
    </HistoryContainer>
  );
};

export default LotteryHistory; 