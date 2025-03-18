import React from 'react';
import styled from 'styled-components';

const DetailContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  position: relative;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
`;

const Subtitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 1.5rem 0 0.5rem;
`;

const InfoGroup = styled.div`
  margin-bottom: 0.75rem;
  display: flex;
`;

const Label = styled.span`
  font-weight: 500;
  color: #666;
  width: 100px;
  flex-shrink: 0;
`;

const Value = styled.span`
  color: #333;
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
  margin-left: 1rem;
  vertical-align: middle;
`;

const Result = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ff4d4f;
  text-align: center;
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #fff1f0;
  border-radius: 8px;
  border: 1px dashed #ffa39e;
`;

const BackButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ExcludedNumbers = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
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

const LotteryHistoryDetail = ({ record, onBack }) => {
  if (!record) {
    return <DetailContainer>未找到记录</DetailContainer>;
  }

  return (
    <DetailContainer>
      <BackButton onClick={onBack}>返回列表</BackButton>
      
      <Title>
        {record.title}
        <StatusBadge isOpen={record.isOpen}>
          {record.isOpen ? '进行中' : '已结束'}
        </StatusBadge>
      </Title>
      
      <Subtitle>基本信息</Subtitle>
      <InfoGroup>
        <Label>创建日期</Label>
        <Value>{formatDate(record.createdAt)}</Value>
      </InfoGroup>
      <InfoGroup>
        <Label>抽奖日期</Label>
        <Value>{formatDate(record.drawDate)}</Value>
      </InfoGroup>
      <InfoGroup>
        <Label>奖品</Label>
        <Value>{record.prize}</Value>
      </InfoGroup>
      <InfoGroup>
        <Label>参与人数</Label>
        <Value>{record.participants ? record.participants.length : 0}/{record.maxParticipants}</Value>
      </InfoGroup>
      
      <Subtitle>抽奖说明</Subtitle>
      <div style={{ marginBottom: '1rem' }}>{record.description}</div>
      
      {record.excludedNumbers && record.excludedNumbers.length > 0 && (
        <ExcludedNumbers>
          排除号码: {record.excludedNumbers.join(', ')}
        </ExcludedNumbers>
      )}
      
      {!record.isOpen && (
        <>
          <Subtitle>抽奖结果</Subtitle>
          <Result>{record.result}</Result>
          <InfoGroup>
            <Label>中奖人</Label>
            <Value>{record.winner}</Value>
          </InfoGroup>
        </>
      )}
    </DetailContainer>
  );
};

export default LotteryHistoryDetail; 