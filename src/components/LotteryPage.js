import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { lotteryAPI } from '../services/api';

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
`;

const Card = styled.div`
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

const SubTitle = styled.h3`
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

const Button = styled.button`
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;

  &:hover {
    background-color: #40a9ff;
  }

  &:disabled {
    background-color: #bfbfbf;
    cursor: not-allowed;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    border-color: #40a9ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 80px;
  
  &:focus {
    border-color: #40a9ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #52c41a;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
`;

const Progress = styled.div`
  height: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  margin: 0.5rem 0 1rem;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: #1890ff;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
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

const LotteryPage = () => {
  const [currentLottery, setCurrentLottery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showParticipateForm, setShowParticipateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    prize: '',
    maxParticipants: 100,
    drawDate: '',
  });
  const [participateFormData, setParticipateFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchCurrentLottery = async () => {
    try {
      setLoading(true);
      const lotteries = await lotteryAPI.getAllLotteries();
      console.log('获取到的抽奖列表:', lotteries); // 调试日志
      
      // 即使返回空数组也是有效的响应
      if (Array.isArray(lotteries)) {
        const openLotteries = lotteries.filter(lottery => lottery.isOpen);
        
        if (openLotteries.length > 0) {
          // 使用最近创建的开放抽奖
          setCurrentLottery(openLotteries[0]);
        } else {
          setCurrentLottery(null);
        }
        
        setError(null);
      } else {
        // 响应格式不符合预期
        setCurrentLottery(null);
        setError('获取抽奖数据格式错误');
        console.error('抽奖数据格式不正确:', lotteries);
      }
    } catch (err) {
      setCurrentLottery(null);
      setError('获取当前抽奖失败，请稍后再试');
      console.error('获取当前抽奖失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentLottery();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      // 验证表单
      if (!createFormData.title || !createFormData.description || !createFormData.prize || !createFormData.drawDate) {
        setFormError('请填写所有必填字段');
        return;
      }

      // 准备数据
      const today = new Date();
      const drawDate = new Date(createFormData.drawDate);
      
      if (drawDate <= today) {
        setFormError('抽奖日期必须在将来');
        return;
      }

      const lotteryData = {
        ...createFormData,
        startDate: today.toISOString(),
        endDate: drawDate.toISOString(),
        isOpen: true,
        participants: []
      };

      // 提交到API
      await lotteryAPI.createLottery(lotteryData);
      setFormSuccess('抽奖活动创建成功');
      setCreateFormData({
        title: '',
        description: '',
        prize: '',
        maxParticipants: 100,
        drawDate: '',
      });
      setShowCreateForm(false);
      
      // 刷新当前抽奖
      await fetchCurrentLottery();
    } catch (error) {
      setFormError('创建抽奖失败: ' + error.message);
    }
  };

  const handleParticipateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      // 验证表单
      if (!participateFormData.name || !participateFormData.phone || !participateFormData.email) {
        setFormError('请填写所有必填字段');
        return;
      }

      // 验证电子邮件格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(participateFormData.email)) {
        setFormError('请输入有效的电子邮件地址');
        return;
      }

      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(participateFormData.phone)) {
        setFormError('请输入有效的手机号码');
        return;
      }

      // 提交到API
      await lotteryAPI.addParticipant(currentLottery._id, participateFormData);
      setFormSuccess('参与成功，祝您好运！');
      setParticipateFormData({
        name: '',
        phone: '',
        email: '',
      });
      setShowParticipateForm(false);
      
      // 刷新当前抽奖
      await fetchCurrentLottery();
    } catch (error) {
      setFormError('参与抽奖失败: ' + error.message);
    }
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParticipateInputChange = (e) => {
    const { name, value } = e.target;
    setParticipateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <Container><Card><Title>当前抽奖</Title><div>加载中...</div></Card></Container>;
  }

  if (error) {
    return <Container><Card><Title>当前抽奖</Title><div style={{ color: 'red' }}>{error}</div></Card></Container>;
  }

  if (!currentLottery && !showCreateForm) {
    return (
      <Container>
        <Card>
          <Title>当前抽奖</Title>
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p>目前没有正在进行的抽奖活动</p>
            <Button onClick={() => setShowCreateForm(true)}>创建新抽奖</Button>
          </div>
        </Card>
        
        {showCreateForm && (
          <Card>
            <Title>创建新抽奖</Title>
            <Form onSubmit={handleCreateSubmit}>
              <FormGroup>
                <label htmlFor="title">标题</label>
                <Input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={createFormData.title}
                  onChange={handleCreateInputChange}
                  placeholder="请输入抽奖标题"
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="description">描述</label>
                <TextArea 
                  id="description" 
                  name="description" 
                  value={createFormData.description}
                  onChange={handleCreateInputChange}
                  placeholder="请输入抽奖描述"
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="prize">奖品</label>
                <Input 
                  type="text" 
                  id="prize" 
                  name="prize" 
                  value={createFormData.prize}
                  onChange={handleCreateInputChange}
                  placeholder="请输入奖品名称"
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="maxParticipants">最大参与人数</label>
                <Input 
                  type="number" 
                  id="maxParticipants" 
                  name="maxParticipants" 
                  min="1"
                  value={createFormData.maxParticipants}
                  onChange={handleCreateInputChange}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="drawDate">抽奖日期</label>
                <Input 
                  type="date" 
                  id="drawDate" 
                  name="drawDate" 
                  value={createFormData.drawDate}
                  onChange={handleCreateInputChange}
                />
              </FormGroup>
              {formError && <ErrorMessage>{formError}</ErrorMessage>}
              {formSuccess && <SuccessMessage>{formSuccess}</SuccessMessage>}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button type="button" onClick={() => setShowCreateForm(false)} style={{ backgroundColor: '#f0f0f0', color: '#333' }}>
                  取消
                </Button>
                <Button type="submit">提交</Button>
              </div>
            </Form>
          </Card>
        )}
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>当前抽奖: {currentLottery?.title}</Title>
        
        <SubTitle>基本信息</SubTitle>
        <InfoGroup>
          <Label>创建日期</Label>
          <Value>{formatDate(currentLottery?.createdAt)}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>抽奖日期</Label>
          <Value>{formatDate(currentLottery?.drawDate)}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>奖品</Label>
          <Value>{currentLottery?.prize}</Value>
        </InfoGroup>
        
        <SubTitle>抽奖说明</SubTitle>
        <div style={{ marginBottom: '1rem' }}>{currentLottery?.description}</div>
        
        <SubTitle>参与情况</SubTitle>
        <InfoGroup>
          <Label>参与人数</Label>
          <Value>{currentLottery?.participants?.length || 0} / {currentLottery?.maxParticipants}</Value>
        </InfoGroup>
        <Progress>
          <ProgressBar percentage={(currentLottery?.participants?.length || 0) / currentLottery?.maxParticipants * 100} />
        </Progress>
        
        {!showParticipateForm ? (
          <Button onClick={() => setShowParticipateForm(true)}>
            立即参与
          </Button>
        ) : (
          <Form onSubmit={handleParticipateSubmit}>
            <FormGroup>
              <label htmlFor="name">姓名</label>
              <Input 
                type="text" 
                id="name" 
                name="name" 
                value={participateFormData.name}
                onChange={handleParticipateInputChange}
                placeholder="请输入您的姓名"
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="phone">手机号</label>
              <Input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={participateFormData.phone}
                onChange={handleParticipateInputChange}
                placeholder="请输入您的手机号"
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="email">电子邮箱</label>
              <Input 
                type="email" 
                id="email" 
                name="email" 
                value={participateFormData.email}
                onChange={handleParticipateInputChange}
                placeholder="请输入您的电子邮箱"
              />
            </FormGroup>
            {formError && <ErrorMessage>{formError}</ErrorMessage>}
            {formSuccess && <SuccessMessage>{formSuccess}</SuccessMessage>}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" onClick={() => setShowParticipateForm(false)} style={{ backgroundColor: '#f0f0f0', color: '#333' }}>
                取消
              </Button>
              <Button type="submit">提交</Button>
            </div>
          </Form>
        )}
      </Card>
      
      {!currentLottery && showCreateForm && (
        <Card>
          <Title>创建新抽奖</Title>
          <Form onSubmit={handleCreateSubmit}>
            <FormGroup>
              <label htmlFor="title">标题</label>
              <Input 
                type="text" 
                id="title" 
                name="title" 
                value={createFormData.title}
                onChange={handleCreateInputChange}
                placeholder="请输入抽奖标题"
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="description">描述</label>
              <TextArea 
                id="description" 
                name="description" 
                value={createFormData.description}
                onChange={handleCreateInputChange}
                placeholder="请输入抽奖描述"
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="prize">奖品</label>
              <Input 
                type="text" 
                id="prize" 
                name="prize" 
                value={createFormData.prize}
                onChange={handleCreateInputChange}
                placeholder="请输入奖品名称"
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="maxParticipants">最大参与人数</label>
              <Input 
                type="number" 
                id="maxParticipants" 
                name="maxParticipants" 
                min="1"
                value={createFormData.maxParticipants}
                onChange={handleCreateInputChange}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="drawDate">抽奖日期</label>
              <Input 
                type="date" 
                id="drawDate" 
                name="drawDate" 
                value={createFormData.drawDate}
                onChange={handleCreateInputChange}
              />
            </FormGroup>
            {formError && <ErrorMessage>{formError}</ErrorMessage>}
            {formSuccess && <SuccessMessage>{formSuccess}</SuccessMessage>}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" onClick={() => setShowCreateForm(false)} style={{ backgroundColor: '#f0f0f0', color: '#333' }}>
                取消
              </Button>
              <Button type="submit">提交</Button>
            </div>
          </Form>
        </Card>
      )}
    </Container>
  );
};

export default LotteryPage; 