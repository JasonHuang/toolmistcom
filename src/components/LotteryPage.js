import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { lotteryAPI } from '../services/api';

const PageContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h1`
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 4rem;
    height: 4px;
    background: linear-gradient(to right, #ff4d4f, #ff7875);
    border-radius: 4px;
  }
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-top: 1rem;
  line-height: 1.5;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.03);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: rgba(255, 77, 79, 0.2);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
  font-weight: 600;
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 20px;
    background: linear-gradient(to bottom, #ff4d4f, #ff7875);
    margin-right: 10px;
    border-radius: 4px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  
  ${props => props.required && `
    &:after {
      content: '*';
      color: #ff4d4f;
      margin-left: 4px;
    }
  `}
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #40a9ff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2);
  }
  
  &:hover {
    border-color: #40a9ff;
  }
  
  &::placeholder {
    color: #bfbfbf;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #40a9ff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2);
  }
  
  &:hover {
    border-color: #40a9ff;
  }
  
  &::placeholder {
    color: #bfbfbf;
  }
`;

const Button = styled.button`
  background: ${props => props.primary ? 
    'linear-gradient(to right, #ff4d4f, #ff7875)' : 
    'white'};
  color: ${props => props.primary ? 'white' : '#666'};
  border: ${props => props.primary ? 'none' : '1px solid #d9d9d9'};
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.primary ? 
    '0 4px 12px rgba(255, 77, 79, 0.3)' : 
    '0 2px 8px rgba(0, 0, 0, 0.05)'};
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: all 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.primary ? 
      '0 6px 16px rgba(255, 77, 79, 0.4)' : 
      '0 4px 12px rgba(0, 0, 0, 0.1)'};
    background-color: ${props => !props.primary && '#f9f9f9'};
    
    &:before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: ${props => props.primary ? 
      '0 3px 8px rgba(255, 77, 79, 0.3)' : 
      '0 2px 6px rgba(0, 0, 0, 0.05)'};
  }
  
  &:disabled {
    background: ${props => props.primary ? '#bfbfbf' : '#f5f5f5'};
    color: ${props => props.primary ? 'white' : '#999'};
    cursor: not-allowed;
    box-shadow: none;
    
    &:before {
      display: none;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 0.95rem;
  margin-top: 0.8rem;
  padding: 0.8rem;
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
  border-radius: 8px;
  display: flex;
  align-items: center;
  
  &:before {
    content: '!';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background-color: #ff4d4f;
    color: white;
    border-radius: 50%;
    margin-right: 8px;
    font-weight: bold;
    flex-shrink: 0;
  }
`;

const SuccessMessage = styled.div`
  color: #52c41a;
  font-size: 0.95rem;
  margin-top: 0.8rem;
  padding: 0.8rem;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  display: flex;
  align-items: center;
  
  &:before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background-color: #52c41a;
    color: white;
    border-radius: 50%;
    margin-right: 8px;
    font-weight: bold;
    flex-shrink: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const CurrentLotteryCard = styled(Card)`
  background: linear-gradient(135deg, #fff8f0 0%, #fff1f0 100%);
  border-left: 4px solid #ff4d4f;
`;

const CurrentLotteryTitle = styled.h3`
  color: #1a1a1a;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -0.3rem;
    left: 0;
    width: 3rem;
    height: 3px;
    background: linear-gradient(to right, #ff4d4f, #ff7875);
    border-radius: 3px;
  }
`;

const LotteryDesc = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
  align-items: center;
  font-size: 0.95rem;
  
  &:hover {
    color: #1a1a1a;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #666;
  width: 100px;
  flex-shrink: 0;
`;

const InfoValue = styled.span`
  color: #1a1a1a;
  font-weight: 500;
`;

const JoinButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  
  &:hover {
    transform: translateY(-3px) scale(1.02);
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
  margin-left: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  &:before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: ${props => props.isOpen ? '#1890ff' : '#52c41a'};
    border-radius: 50%;
    margin-right: 6px;
  }
`;

const ParticipantCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px dashed #ffa39e;
  
  .count {
    font-size: 1.2rem;
    font-weight: 600;
    color: #ff4d4f;
  }
  
  .label {
    font-size: 0.9rem;
    color: #666;
  }
`;

// 设置默认表单数据
const defaultLotteryForm = {
  title: '',
  prize: '',
  maxParticipants: 50,
  drawDate: '',
  description: ''
};

const LotteryPage = () => {
  const [formData, setFormData] = useState(defaultLotteryForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentLottery, setCurrentLottery] = useState(null);
  const [participantForm, setParticipantForm] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  // 页面加载时获取当前抽奖
  useEffect(() => {
    fetchCurrentLottery();
  }, []);

  // 获取当前正在进行的抽奖
  const fetchCurrentLottery = async () => {
    try {
      const response = await lotteryAPI.getCurrentLottery();
      if (response) {
        setCurrentLottery(response);
      }
    } catch (error) {
      console.error('获取当前抽奖失败', error);
    }
  };

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理创建抽奖
  const handleCreateLottery = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 基本表单验证
    if (!formData.title || !formData.prize || !formData.drawDate) {
      setError('请填写所有必填字段');
      return;
    }

    // 抽奖日期必须是将来的日期
    const drawDate = new Date(formData.drawDate);
    const today = new Date();
    if (drawDate <= today) {
      setError('抽奖日期必须是将来的日期');
      return;
    }

    try {
      setLoading(true);
      await lotteryAPI.createLottery(formData);
      setSuccess('抽奖创建成功！');
      setFormData(defaultLotteryForm);
      
      // 刷新当前抽奖
      await fetchCurrentLottery();
    } catch (error) {
      setError(`创建失败: ${error.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  // 处理参与表单变化
  const handleParticipantChange = (e) => {
    const { name, value } = e.target;
    setParticipantForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理参与抽奖
  const handleJoinLottery = async (e) => {
    e.preventDefault();
    setJoinError('');
    setJoinSuccess('');

    // 表单验证
    if (!participantForm.name || !participantForm.phone) {
      setJoinError('请填写姓名和手机号');
      return;
    }

    if (participantForm.phone && !/^1[3-9]\d{9}$/.test(participantForm.phone)) {
      setJoinError('请输入有效的手机号码');
      return;
    }

    if (participantForm.email && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(participantForm.email)) {
      setJoinError('请输入有效的邮箱地址');
      return;
    }

    try {
      setJoinLoading(true);
      await lotteryAPI.joinLottery(currentLottery._id, participantForm);
      setJoinSuccess('参与成功！');
      setParticipantForm({
        name: '',
        phone: '',
        email: ''
      });
      
      // 刷新当前抽奖
      await fetchCurrentLottery();
    } catch (error) {
      setJoinError(`参与失败: ${error.message || '未知错误'}`);
    } finally {
      setJoinLoading(false);
    }
  };

  // 格式化日期显示
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <PageContainer>
      <div>
        <Title>幸运抽奖</Title>
        <Subtitle>创建新的抽奖活动或参与正在进行的抽奖，赢取丰厚奖品！</Subtitle>
      </div>
      
      <CardsContainer>
        <Card>
          <CardTitle>创建新的抽奖</CardTitle>
          <form onSubmit={handleCreateLottery}>
            <FormGroup>
              <Label required>抽奖标题</Label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="例如：新年特别抽奖"
              />
            </FormGroup>
            
            <FormGroup>
              <Label required>奖品</Label>
              <Input
                type="text"
                name="prize"
                value={formData.prize}
                onChange={handleInputChange}
                placeholder="例如：iPhone 15 Pro"
              />
            </FormGroup>
            
            <FormGroup>
              <Label required>最大参与人数</Label>
              <Input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                min="1"
              />
            </FormGroup>
            
            <FormGroup>
              <Label required>抽奖日期</Label>
              <Input
                type="date"
                name="drawDate"
                value={formData.drawDate}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>抽奖说明</Label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="请输入抽奖活动的详细说明..."
              />
            </FormGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
            
            <ButtonGroup>
              <Button 
                type="button" 
                onClick={() => setFormData(defaultLotteryForm)}
              >
                重置
              </Button>
              <Button 
                type="submit" 
                primary
                disabled={loading}
              >
                {loading ? '创建中...' : '创建抽奖'}
              </Button>
            </ButtonGroup>
          </form>
        </Card>
        
        {currentLottery ? (
          <CurrentLotteryCard>
            <CurrentLotteryTitle>
              {currentLottery.title}
              <StatusBadge isOpen={currentLottery.isOpen}>
                {currentLottery.isOpen ? '进行中' : '已结束'}
              </StatusBadge>
            </CurrentLotteryTitle>
            
            <LotteryDesc>{currentLottery.description}</LotteryDesc>
            
            <InfoItem>
              <InfoLabel>创建日期</InfoLabel>
              <InfoValue>{formatDate(currentLottery.createdAt)}</InfoValue>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel>抽奖日期</InfoLabel>
              <InfoValue>{formatDate(currentLottery.drawDate)}</InfoValue>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel>奖品</InfoLabel>
              <InfoValue>{currentLottery.prize}</InfoValue>
            </InfoItem>
            
            <ParticipantCount>
              <div className="label">当前参与人数</div>
              <div className="count">
                {currentLottery.participants ? currentLottery.participants.length : 0}/{currentLottery.maxParticipants}
              </div>
            </ParticipantCount>
            
            {currentLottery.isOpen && (
              <>
                <form onSubmit={handleJoinLottery}>
                  <FormGroup>
                    <Label required>姓名</Label>
                    <Input
                      type="text"
                      name="name"
                      value={participantForm.name}
                      onChange={handleParticipantChange}
                      placeholder="请输入您的姓名"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label required>手机号码</Label>
                    <Input
                      type="tel"
                      name="phone"
                      value={participantForm.phone}
                      onChange={handleParticipantChange}
                      placeholder="请输入您的手机号码"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>电子邮箱</Label>
                    <Input
                      type="email"
                      name="email"
                      value={participantForm.email}
                      onChange={handleParticipantChange}
                      placeholder="请输入您的电子邮箱"
                    />
                  </FormGroup>
                  
                  {joinError && <ErrorMessage>{joinError}</ErrorMessage>}
                  {joinSuccess && <SuccessMessage>{joinSuccess}</SuccessMessage>}
                  
                  <JoinButton 
                    type="submit" 
                    primary
                    disabled={joinLoading || currentLottery.participants.length >= currentLottery.maxParticipants}
                  >
                    {joinLoading ? '提交中...' : '立即参与抽奖'}
                  </JoinButton>
                </form>
              </>
            )}
            
            {!currentLottery.isOpen && (
              <SuccessMessage>
                本次抽奖已结束，获奖者：{currentLottery.winner || '暂未公布'}
              </SuccessMessage>
            )}
          </CurrentLotteryCard>
        ) : (
          <Card>
            <CardTitle>当前没有抽奖活动</CardTitle>
            <p>目前没有正在进行的抽奖活动，请创建一个新的抽奖或查看历史记录。</p>
          </Card>
        )}
      </CardsContainer>
    </PageContainer>
  );
};

export default LotteryPage; 