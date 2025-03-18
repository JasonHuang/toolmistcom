import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { lotteryAPI } from '../services/api';

const HistoryContainer = styled.div`
  width: 100%;
  max-width: 900px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid #f0f0f0;
  color: #666;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => props.isOpen ? '#e6f7ff' : '#f6ffed'};
  color: ${props => props.isOpen ? '#1890ff' : '#52c41a'};
  border: 1px solid ${props => props.isOpen ? '#91d5ff' : '#b7eb8f'};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
`;

const ViewButton = styled.button`
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #40a9ff;
  }
`;

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const LotteryHistory = ({ onRecordSelect }) => {
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        setLoading(true);
        const data = await lotteryAPI.getAllLotteries();
        setLotteries(data);
        setError(null);
      } catch (err) {
        setError('获取抽奖历史失败，请稍后再试');
        console.error('获取抽奖历史失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLotteries();
  }, []);

  const handleViewDetails = (record) => {
    if (onRecordSelect) {
      onRecordSelect(record);
    }
  };

  if (loading) {
    return <HistoryContainer><Title>历届抽奖</Title><div>加载中...</div></HistoryContainer>;
  }

  if (error) {
    return <HistoryContainer><Title>历届抽奖</Title><div style={{ color: 'red' }}>{error}</div></HistoryContainer>;
  }

  return (
    <HistoryContainer>
      <Title>历届抽奖</Title>
      {lotteries.length === 0 ? (
        <EmptyMessage>暂无抽奖历史记录</EmptyMessage>
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>日期</Th>
              <Th>标题</Th>
              <Th>抽奖日期</Th>
              <Th>奖品</Th>
              <Th>状态</Th>
              <Th>操作</Th>
            </Tr>
          </thead>
          <tbody>
            {lotteries.map((lottery) => (
              <Tr key={lottery._id}>
                <Td>{formatDate(lottery.createdAt)}</Td>
                <Td>{lottery.title}</Td>
                <Td>{formatDate(lottery.drawDate)}</Td>
                <Td>{lottery.prize}</Td>
                <Td>
                  <StatusBadge isOpen={lottery.isOpen}>
                    {lottery.isOpen ? '进行中' : '已结束'}
                  </StatusBadge>
                </Td>
                <Td>
                  <ViewButton onClick={() => handleViewDetails(lottery)}>
                    查看详情
                  </ViewButton>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </HistoryContainer>
  );
};

export default LotteryHistory; 