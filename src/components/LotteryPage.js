import React, { useState } from 'react';
import styled from 'styled-components';
import { lotteryAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h1`
  color: #1a1a1a;
  margin-bottom: 0.3rem;
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -0.4rem;
    left: 0;
    width: 3.5rem;
    height: 3px;
    background: linear-gradient(to right, #ff4d4f, #ff7875);
    border-radius: 4px;
  }
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin-top: 0.7rem;
  margin-bottom: 0.3rem;
  line-height: 1.4;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  margin-bottom: 0.3rem;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
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
  padding: 0.6rem 0.8rem;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 0.95rem;
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
  padding: 0.6rem 0.8rem;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 0.95rem;
  min-height: 80px;
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
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
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
    transform: translateY(-2px);
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
  font-size: 0.9rem;
  margin-top: 0.6rem;
  padding: 0.6rem;
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
  border-radius: 6px;
  display: flex;
  align-items: center;
  
  &:before {
    content: '!';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
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
  font-size: 0.9rem;
  margin-top: 0.6rem;
  padding: 0.6rem;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  display: flex;
  align-items: center;
  
  &:before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
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
  gap: 0.8rem;
  margin-top: 0.8rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-right: 8px;
  cursor: pointer;
  accent-color: #ff4d4f;
`;

const CheckboxLabel = styled.label`
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #ff4d4f;
  }
`;

// 添加日期选择按钮样式
const DateButtonGroup = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-top: 0.4rem;
  flex-wrap: wrap;
`;

const DateButton = styled.button`
  padding: 0.4rem 0.6rem;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background-color: white;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #40a9ff;
    color: #40a9ff;
  }
  
  &:active {
    background-color: #f0f7ff;
  }
`;

// 添加一个用于并排字段的容器
const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.flex || '1'};
`;

// 添加四列布局组件
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// 设置默认表单数据
const defaultLotteryForm = {
  title: '',
  prize: '',
  maxParticipants: 50,
  drawDate: new Date().toISOString().split('T')[0], // 默认为当前日期
  description: '',
  isImmediateDraw: false,
  customRangeEnabled: false,
  startNumber: '1',
  endNumber: '99'
};

const LotteryPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultLotteryForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理日期选择按钮点击
  const handleDateButtonClick = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const formattedDate = date.toISOString().split('T')[0];
    
    setFormData(prev => ({
      ...prev,
      drawDate: formattedDate
    }));
  };

  // 处理创建抽奖
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // 验证必填字段
    if (!formData.title || !formData.prize || !formData.description) {
      setError('请填写所有必填字段');
      setLoading(false);
      return;
    }

    // 如果不是立即开奖，还需要验证抽奖日期
    if (!formData.isImmediateDraw && !formData.drawDate) {
      setError('请选择抽奖日期');
      setLoading(false);
      return;
    }

    // 验证抽奖日期
    if (!formData.isImmediateDraw) {
      const drawDate = new Date(formData.drawDate);
      // 获取时区不受影响的日期部分
      const drawYear = drawDate.getFullYear();
      const drawMonth = drawDate.getMonth();
      const drawDay = drawDate.getDate();
      
      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth();
      const todayDay = today.getDate();
      
      // 比较年月日
      const drawDateValue = new Date(drawYear, drawMonth, drawDay, 0, 0, 0, 0);
      const todayValue = new Date(todayYear, todayMonth, todayDay, 0, 0, 0, 0);

      if (drawDateValue < todayValue) {
        setError('抽奖日期不能早于今天');
        setLoading(false);
        return;
      }
    }

    // 验证抽奖范围
    if (formData.customRangeEnabled) {
      const startNum = parseInt(formData.startNumber);
      const endNum = parseInt(formData.endNumber);
      
      if (isNaN(startNum) || isNaN(endNum)) {
        setError('请输入有效的抽奖范围');
        setLoading(false);
        return;
      }
      
      if (startNum >= endNum) {
        setError('起始数字必须小于结束数字');
        setLoading(false);
        return;
      }
      
      if (startNum < 0 || endNum > 99) {
        setError('抽奖范围必须在0-99之间');
        setLoading(false);
        return;
      }
    }

    try {
      // 格式化日期为 YYYY-MM-DD
      const today = new Date();
      // 使用本地日期格式避免时区问题
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedStartDate = `${year}-${month}-${day}`;
      
      let formattedDrawDate, formattedEndDate;
      
      if (formData.isImmediateDraw) {
        // 立即开奖模式：开始日期、结束日期和抽奖日期都设为今天
        formattedDrawDate = formattedStartDate;
        formattedEndDate = formattedStartDate;
      } else {
        // 普通模式：使用用户选择的抽奖日期
        const drawDate = new Date(formData.drawDate);
        // 同样使用本地日期格式
        const drawYear = drawDate.getFullYear();
        const drawMonth = String(drawDate.getMonth() + 1).padStart(2, '0');
        const drawDay = String(drawDate.getDate()).padStart(2, '0');
        formattedDrawDate = `${drawYear}-${drawMonth}-${drawDay}`;
        formattedEndDate = formattedDrawDate;
      }

      const lotteryData = {
        title: formData.title,
        description: formData.description,
        prize: formData.prize,
        drawDate: formattedDrawDate,
        maxParticipants: formData.maxParticipants || 100,
        isOpen: true, // 始终设为开放状态，无论是否是立即开奖模式
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        isImmediateDraw: formData.isImmediateDraw,
        // 添加抽奖范围
        startNumber: formData.customRangeEnabled ? formData.startNumber : '1',
        endNumber: formData.customRangeEnabled ? formData.endNumber : '99'
      };

      console.log('Sending lottery data:', lotteryData);
      const response = await lotteryAPI.createLottery(lotteryData);
      console.log('Server response:', response);

      setSuccess('抽奖创建成功！');
      
      // 如果是立即开奖，直接跳转到详情页，不再自动执行抽奖
      if (formData.isImmediateDraw && response._id) {
        navigate(`/lottery/${response._id}`);
      } else if (response._id) {
        // 普通抽奖创建成功，重置表单
        setFormData(defaultLotteryForm);
      }
    } catch (err) {
      console.error('Error creating lottery:', err);
      setError(err.message || '创建抽奖失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div>
        <Title>创建新的抽奖</Title>
        <Subtitle>填写表单创建一个新的抽奖活动</Subtitle>
      </div>
      
      <form onSubmit={handleSubmit}>
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
        
        <FormGrid>
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
            <Label>起始数字</Label>
            <Input
              type="number"
              name="startNumber"
              value={formData.startNumber}
              onChange={handleInputChange}
              min="0"
              max="98"
              disabled={!formData.customRangeEnabled}
              style={{
                backgroundColor: !formData.customRangeEnabled ? '#f5f5f5' : 'white',
                cursor: !formData.customRangeEnabled ? 'not-allowed' : 'pointer'
              }}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>结束数字</Label>
            <Input
              type="number"
              name="endNumber"
              value={formData.endNumber}
              onChange={handleInputChange}
              min="1"
              max="99"
              disabled={!formData.customRangeEnabled}
              style={{
                backgroundColor: !formData.customRangeEnabled ? '#f5f5f5' : 'white',
                cursor: !formData.customRangeEnabled ? 'not-allowed' : 'pointer'
              }}
            />
          </FormGroup>
        </FormGrid>
        
        <FormRow>
          <FormColumn>
            <Label required>开奖日期</Label>
            <Input
              type="date"
              name="drawDate"
              value={formData.drawDate}
              onChange={handleInputChange}
              disabled={formData.isImmediateDraw}
              style={{
                backgroundColor: formData.isImmediateDraw ? '#f5f5f5' : 'white',
                cursor: formData.isImmediateDraw ? 'not-allowed' : 'pointer'
              }}
            />
            {!formData.isImmediateDraw && (
              <DateButtonGroup>
                <DateButton 
                  type="button" 
                  onClick={() => handleDateButtonClick(0)}
                >
                  今天
                </DateButton>
                <DateButton 
                  type="button" 
                  onClick={() => handleDateButtonClick(7)}
                >
                  7天后
                </DateButton>
                <DateButton 
                  type="button" 
                  onClick={() => handleDateButtonClick(15)}
                >
                  15天后
                </DateButton>
                <DateButton 
                  type="button" 
                  onClick={() => handleDateButtonClick(30)}
                >
                  30天后
                </DateButton>
              </DateButtonGroup>
            )}
          </FormColumn>
          
          <FormColumn>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <CheckboxContainer style={{ marginBottom: '0' }}>
                <Checkbox 
                  type="checkbox" 
                  id="isImmediateDraw"
                  name="isImmediateDraw"
                  checked={formData.isImmediateDraw}
                  onChange={(e) => {
                    const { name, checked } = e.target;
                    if (checked) {
                      const today = new Date();
                      const year = today.getFullYear();
                      const month = String(today.getMonth() + 1).padStart(2, '0');
                      const day = String(today.getDate()).padStart(2, '0');
                      const formattedDate = `${year}-${month}-${day}`;
                      
                      setFormData(prev => ({
                        ...prev,
                        [name]: checked,
                        drawDate: formattedDate
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        [name]: checked
                      }));
                    }
                  }}
                />
                <CheckboxLabel htmlFor="isImmediateDraw">
                  创建后立即开奖
                </CheckboxLabel>
              </CheckboxContainer>
              
              <CheckboxContainer style={{ marginBottom: '0' }}>
                <Checkbox 
                  type="checkbox" 
                  id="customRangeEnabled"
                  name="customRangeEnabled"
                  checked={formData.customRangeEnabled}
                  onChange={(e) => {
                    const { name, checked } = e.target;
                    setFormData(prev => ({
                      ...prev,
                      [name]: checked
                    }));
                  }}
                />
                <CheckboxLabel htmlFor="customRangeEnabled">
                  自定义抽奖号码范围
                </CheckboxLabel>
              </CheckboxContainer>
              
              {formData.isImmediateDraw && (
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#999',
                  marginTop: '0.2rem' 
                }}>
                  立即开奖模式下，开奖日期设为今天
                </div>
              )}
              
              {!formData.customRangeEnabled && (
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#999'
                }}>
                  默认抽奖范围：1-99
                </div>
              )}
            </div>
          </FormColumn>
        </FormRow>
        
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
            onClick={() => {
              setFormData(defaultLotteryForm);
            }}
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
    </PageContainer>
  );
};

export default LotteryPage; 