import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { lotteryAPI } from '../services/api';

const HistoryContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #f0f0f0;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  span {
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -0.9rem;
      left: 0;
      width: 3rem;
      height: 3px;
      background: linear-gradient(to right, #ff4d4f, #ff7875);
      border-radius: 3px;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  color: #1a1a1a;
  font-weight: 600;
  font-size: 1rem;
  background-color: #fafafa;
  border-bottom: 2px solid #f0f0f0;
  
  &:first-child {
    border-top-left-radius: 8px;
  }
  
  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const TableRow = styled.tr`
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #fafafa;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #333;
  font-size: 0.95rem;
  
  &:first-child {
    font-weight: 500;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background-color: ${props => props.isOpen ? '#e6f7ff' : '#f6ffed'};
  color: ${props => props.isOpen ? '#1890ff' : '#52c41a'};
  border: 1px solid ${props => props.isOpen ? '#91d5ff' : '#b7eb8f'};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: ${props => props.isOpen ? '#1890ff' : '#52c41a'};
    border-radius: 50%;
    margin-right: 6px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const EmptyMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #999;
  font-size: 1rem;
  background-color: #fafafa;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px dashed #d9d9d9;
`;

const ViewButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, #1890ff, #40a9ff);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  
  &:before {
    content: '→';
    margin-right: 6px;
    font-size: 1.1rem;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(to right, #40a9ff, #69c0ff);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    
    &:before {
      transform: translateX(3px);
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
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
      <Title>
        <span>抽奖历史记录</span>
      </Title>
      
      {lotteries.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <TableHeader>标题</TableHeader>
              <TableHeader>创建日期</TableHeader>
              <TableHeader>开奖日期</TableHeader>
              <TableHeader>奖品</TableHeader>
              <TableHeader>状态</TableHeader>
              <TableHeader>获奖者</TableHeader>
              <TableHeader>操作</TableHeader>
            </tr>
          </thead>
          <tbody>
            {lotteries.map((record) => (
              <TableRow key={record._id}>
                <TableCell>{record.title}</TableCell>
                <TableCell>{formatDate(record.createdAt)}</TableCell>
                <TableCell>{formatDate(record.drawDate)}</TableCell>
                <TableCell>{record.prize}</TableCell>
                <TableCell>
                  <StatusBadge isOpen={record.isOpen}>
                    {record.isOpen ? '进行中' : '已结束'}
                  </StatusBadge>
                </TableCell>
                <TableCell>{record.winner || '-'}</TableCell>
                <TableCell>
                  <ViewButton onClick={() => handleViewDetails(record)}>
                    查看详情
                  </ViewButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyMessage>暂无抽奖历史记录</EmptyMessage>
      )}
    </HistoryContainer>
  );
};

export default LotteryHistory; 