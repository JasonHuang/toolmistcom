import React from 'react';
import styled from 'styled-components';

const DetailContainer = styled.div`
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

const Subtitle = styled.h3`
  color: #4a90e2;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 18px;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
`;

const InfoGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.div`
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  color: #333;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const Result = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #4a90e2;
  text-align: center;
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const BackButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;

  &:hover {
    background-color: #5a6268;
  }
`;

const ExcludedNumbers = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 0.5rem;
`;

const ExcludedNumber = styled.span`
  background-color: #f1f1f1;
  color: #333;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  display: inline-block;
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const LotteryHistoryDetail = ({ record, onBack }) => {
  if (!record) {
    return (
      <DetailContainer>
        <Title>抽奖详情</Title>
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>未找到抽奖记录</div>
        <div style={{ textAlign: 'center' }}>
          <BackButton onClick={onBack}>返回列表</BackButton>
        </div>
      </DetailContainer>
    );
  }

  // 解析抽奖范围
  const [rangeStart, rangeEnd] = record.range.split('-').map(num => parseInt(num, 10));

  return (
    <DetailContainer>
      <Title>{record.title}</Title>
      
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <StatusBadge isOpen={record.isOpen}>
          {record.isOpen ? '待开奖' : '已开奖'}
        </StatusBadge>
      </div>
      
      <Subtitle>基本信息</Subtitle>
      <Grid>
        <InfoGroup>
          <Label>抽奖描述</Label>
          <Value>{record.description}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>抽奖日期</Label>
          <Value>{formatDate(record.date)}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>开奖日期</Label>
          <Value>{formatDate(record.drawDate)}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>奖品</Label>
          <Value>{record.prize}</Value>
        </InfoGroup>
      </Grid>
      
      <Subtitle>抽奖规则</Subtitle>
      <Grid>
        <InfoGroup>
          <Label>数字范围</Label>
          <Value>{rangeStart} - {rangeEnd}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>排除数字</Label>
          {record.excluded.length > 0 ? (
            <ExcludedNumbers>
              {record.excluded.map((num) => (
                <ExcludedNumber key={num}>{num}</ExcludedNumber>
              ))}
            </ExcludedNumbers>
          ) : (
            <Value>无</Value>
          )}
        </InfoGroup>
      </Grid>
      
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
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <BackButton onClick={onBack}>返回列表</BackButton>
      </div>
    </DetailContainer>
  );
};

export default LotteryHistoryDetail; 