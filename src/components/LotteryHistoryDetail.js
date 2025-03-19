import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { lotteryAPI } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const DetailContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
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
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.8rem;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.h3`
  font-size: 1.2rem;
  color: #1a1a1a;
  margin: 1.5rem 0 0.8rem;
  font-weight: 600;
  letter-spacing: -0.3px;
  position: relative;
  
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

const InfoGroup = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #fafafa;
    border-radius: 6px;
    padding: 0.3rem;
    margin-left: -0.3rem;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: #666;
  width: 80px;
  flex-shrink: 0;
  font-size: 0.9rem;
`;

const Value = styled.span`
  color: #1a1a1a;
  font-size: 0.95rem;
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
  vertical-align: middle;
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

const Result = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #ff4d4f;
  text-align: center;
  margin: 1.5rem 0;
  padding: 1.5rem;
  background-color: #fff1f0;
  border-radius: 12px;
  border: 1px dashed #ffa39e;
  box-shadow: 0 8px 16px rgba(255, 77, 79, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 20px rgba(255, 77, 79, 0.2);
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ff4d4f;
  }
  
  &:before {
    content: '←';
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

const ExcludedNumbers = styled.div`
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #666;
  background-color: #f9f9f9;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border-left: 3px solid #ff4d4f;
`;

const DrawButton = styled.button`
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  width: 100%;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
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
    box-shadow: 0 6px 16px rgba(255, 77, 79, 0.4);
    
    &:before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(255, 77, 79, 0.3);
  }

  &:disabled {
    background: #bfbfbf;
    cursor: not-allowed;
    box-shadow: none;
    
    &:before {
      display: none;
    }
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 12px;
  backdrop-filter: blur(3px);
`;

const Spinner = styled.div`
  border: 4px solid rgba(24, 144, 255, 0.1);
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 10px rgba(24, 144, 255, 0.2);
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #ff4d4f;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 1rem;
  width: ${props => props.width || '100%'};
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #40a9ff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2);
  }
  
  &:hover {
    border-color: #40a9ff;
  }
`;

const DrawSettings = styled.div`
  background-color: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  background-color: #f5f5f5;
  border-radius: 15px;
  margin-right: 0.6rem;
  margin-bottom: 0.6rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border: 1px solid #e8e8e8;
  
  button {
    background: none;
    border: none;
    color: #999;
    margin-left: 6px;
    cursor: pointer;
    font-size: 16px;
    padding: 0 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    &:hover {
      color: #ff4d4f;
      transform: scale(1.2);
    }
  }
  
  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }
`;

const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.8rem;
`;

const DrawAnimationContainer = styled.div`
  width: 100%;
  height: 150px;
  background: linear-gradient(135deg, #fff1f0 0%, #fff5f0 100%);
  border-radius: 12px;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  box-shadow: 0 12px 28px rgba(255, 77, 79, 0.25);
  border: 3px solid #ffa39e;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 16px 32px rgba(255, 77, 79, 0.3);
    transform: translateY(-3px);
  }
`;

const AnimationNumber = styled.div`
  font-size: 5rem;
  font-weight: bold;
  color: #ff4d4f;
  text-shadow: 2px 2px 8px rgba(255, 77, 79, 0.3);
  animation: ${props => props.isSlowing ? 'pulse 0.5s infinite' : 'none'};
  transform-origin: center;
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      text-shadow: 2px 2px 8px rgba(255, 77, 79, 0.3);
    }
    50% {
      transform: scale(1.2);
      text-shadow: 0 0 20px rgba(255, 77, 79, 0.8);
    }
    100% {
      transform: scale(1);
      text-shadow: 2px 2px 8px rgba(255, 77, 79, 0.3);
    }
  }
`;

const Confetti = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: -10%;
    left: 0;
    width: 100%;
    height: 120%;
    background-image: 
      radial-gradient(circle, #ff4d4f 2px, transparent 2px),
      radial-gradient(circle, #1890ff 2px, transparent 2px),
      radial-gradient(circle, #52c41a 2px, transparent 2px),
      radial-gradient(circle, #faad14 2px, transparent 2px);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px, 15px 5px, 5px 15px;
    animation: confettiFall 2s linear infinite;
  }
  
  @keyframes confettiFall {
    0% {
      transform: translateY(-10%) rotate(0deg);
    }
    100% {
      transform: translateY(100%) rotate(10deg);
    }
  }
`;

const FinalResultContainer = styled.div`
  position: relative;
  margin: 2.5rem 0;
  animation: fadeIn 0.8s ease-in;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const FinalResult = styled(Result)`
  position: relative;
  overflow: hidden;
  font-size: 3.5rem;
  background: linear-gradient(135deg, #fff1f0 0%, #fff8f0 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    animation: shine 3s infinite ease-in-out;
  }
  
  @keyframes shine {
    0% {
      transform: translateX(-100%) rotate(30deg);
    }
    100% {
      transform: translateX(100%) rotate(30deg);
    }
  }
`;

const ResultLabel = styled.div`
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  color: #ff4d4f;
  margin-bottom: 1.2rem;
  animation: bounce 1.2s ease infinite;
  text-shadow: 1px 1px 3px rgba(255, 77, 79, 0.2);
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }
`;

const NumberGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  justify-content: center;
`;

const NumberCell = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: ${props => props.active || props.highlight ? 'bold' : 'normal'};
  border-radius: 8px;
  border: 1px solid ${props => props.highlight ? '#ff4d4f' : '#e8e8e8'};
  background-color: ${props => {
    if (props.highlight) return '#fff1f0';
    if (props.active) return '#f0f7ff';
    return 'white';
  }};
  color: ${props => {
    if (props.highlight) return '#ff4d4f';
    if (props.active) return '#1890ff';
    return '#333';
  }};
  transition: all 0.2s ease;
  transform: ${props => props.active ? 'scale(1.15)' : 'scale(1)'};
  box-shadow: ${props => props.active ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none'};
  
  ${props => props.highlight && css`
    animation: pulse 2s infinite;
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(255, 77, 79, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(255, 77, 79, 0);
      }
    }
  `}
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem 1.5rem;
  margin-bottom: 1.5rem;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
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

const LotteryHistoryDetail = ({ record: propRecord, onBack }) => {
  const { id: urlId } = useParams();
  const navigate = useNavigate();
  const [lottery, setLottery] = useState(propRecord || null);
  const [loading, setLoading] = useState(!propRecord);
  const [error, setError] = useState('');
  const [showDrawSettings, setShowDrawSettings] = useState(false);
  const [excludedNumbers, setExcludedNumbers] = useState([]);
  const [excludedInput, setExcludedInput] = useState('');
  const [startNumber, setStartNumber] = useState(1);
  const [endNumber, setEndNumber] = useState(99);
  
  // 抽奖动画相关状态
  const [animationRunning, setAnimationRunning] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [isSlowing, setIsSlowing] = useState(false);
  const [finalNumber, setFinalNumber] = useState(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  
  const animationRef = useRef(null);
  const availableNumbersRef = useRef([]);

  useEffect(() => {
    // 如果直接传入了record属性，不需要从API获取
    if (propRecord) {
      setLottery(propRecord);
      // 初始化抽奖参数
      initializeLotteryParams(propRecord);
      setLoading(false);
      return;
    }
    
    const fetchLottery = async () => {
      // 验证 id 参数
      if (!urlId) {
        setError('无效的抽奖ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        console.log('Fetching lottery with ID:', urlId);
        const data = await lotteryAPI.getLotteryById(urlId);
        console.log('Received lottery data:', data);
        setLottery(data);
        // 初始化抽奖参数
        initializeLotteryParams(data);
      } catch (err) {
        console.error('获取抽奖详情失败:', err);
        setError(err.message || '获取抽奖详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchLottery();
  }, [urlId, propRecord]);

  // 初始化抽奖参数
  const initializeLotteryParams = (lotteryData) => {
    if (lotteryData.startNumber) {
      setStartNumber(parseInt(lotteryData.startNumber));
    }
    if (lotteryData.endNumber) {
      setEndNumber(parseInt(lotteryData.endNumber));
    }
    if (lotteryData.excludedNumbers && lotteryData.excludedNumbers.length > 0) {
      setExcludedNumbers(lotteryData.excludedNumbers.map(num => parseInt(num)));
    }
  };

  // 清理动画定时器 - 移到组件顶部
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <DetailContainer>
        <LoadingMessage>加载中...</LoadingMessage>
      </DetailContainer>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <DetailContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <BackButton onClick={() => {
          if (onBack) {
            // 如果是通过MainContainer渲染的，使用onBack回调
            onBack();
          } else {
            // 如果是通过路由渲染的，使用navigate返回
            navigate('/lottery');
          }
        }}>返回列表</BackButton>
      </DetailContainer>
    );
  }

  // 如果没有抽奖数据，显示未找到信息
  if (!lottery) {
    return (
      <DetailContainer>
        <ErrorMessage>未找到该抽奖活动</ErrorMessage>
        <BackButton onClick={() => {
          if (onBack) {
            // 如果是通过MainContainer渲染的，使用onBack回调
            onBack();
          } else {
            // 如果是通过路由渲染的，使用navigate返回
            navigate('/lottery');
          }
        }}>返回列表</BackButton>
      </DetailContainer>
    );
  }

  // 生成可用数字集合
  const generateAvailableNumbers = () => {
    const numbers = [];
    for (let i = startNumber; i <= endNumber; i++) {
      if (!excludedNumbers.includes(i)) {
        numbers.push(i);
      }
    }
    return numbers;
  };

  // 处理添加排除数字
  const handleAddExcludedNumber = () => {
    if (!excludedInput.trim()) return;

    // 支持逗号分隔的多个数字或空格分隔的多个数字
    const inputNumbers = excludedInput
      .split(/[,，\s]+/)
      .map(num => num.trim())
      .filter(num => num !== '')
      .map(num => parseInt(num, 10))
      .filter(num => !isNaN(num) && num >= 0 && num <= 99);

    if (inputNumbers.length === 0) {
      setError('请输入有效的数字(0-99)');
      return;
    }

    // 添加新的排除数字（避免重复）
    const newExcluded = [...excludedNumbers];
    
    inputNumbers.forEach(num => {
      if (!newExcluded.includes(num)) {
        newExcluded.push(num);
      }
    });
    
    // 按数字顺序排序
    newExcluded.sort((a, b) => a - b);
    
    setExcludedNumbers(newExcluded);
    setExcludedInput('');
  };

  // 处理移除排除数字
  const handleRemoveExcludedNumber = (numberToRemove) => {
    setExcludedNumbers(excludedNumbers.filter(num => num !== numberToRemove));
  };

  // 处理抽奖动画
  const handleDrawAnimation = () => {
    if (animationRunning) return;
    
    // 验证抽奖范围
    if (startNumber >= endNumber) {
      setError('起始数字必须小于结束数字');
      return;
    }

    if (startNumber < 0 || endNumber > 99) {
      setError('抽奖范围必须在0-99之间');
      return;
    }
    
    const availableNumbers = generateAvailableNumbers();
    if (availableNumbers.length === 0) {
      setError('排除的数字太多，没有可选的数字了');
      return;
    }
    
    availableNumbersRef.current = availableNumbers;
    setAnimationRunning(true);
    setFinalNumber(null);
    
    let count = 0;
    const totalIterations = 60; // 总迭代次数
    const accelerationPhase = 15; // 加速阶段
    const steadyPhase = 25; // 匀速阶段
    
    // 清除之前的动画
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    
    // 创建一个可以递归调用的函数
    const animateDrawing = (interval = 200) => {
      count++;
      
      // 获取随机数
      const randomIndex = Math.floor(Math.random() * availableNumbersRef.current.length);
      const number = availableNumbersRef.current[randomIndex];
      setCurrentNumber(number);
      
      // 计算动画间隔 (加速到减速)
      let nextInterval;
      
      if (count < accelerationPhase) {
        // 加速阶段: 从500ms到50ms，使用指数函数使加速更自然
        const progress = count / accelerationPhase;
        nextInterval = 500 - (450 * Math.pow(progress, 2));
        setIsSlowing(false);
      } else if (count < accelerationPhase + steadyPhase) {
        // 匀速阶段: 50ms
        nextInterval = 50;
        setIsSlowing(false);
      } else {
        // 减速阶段: 从50ms到800ms，使用指数函数使减速更自然
        const deceleration = (count - accelerationPhase - steadyPhase) / (totalIterations - accelerationPhase - steadyPhase);
        nextInterval = 50 + (750 * Math.pow(deceleration, 0.5));
        setIsSlowing(true); // 进入减速阶段，触发脉动动画
      }
      
      // 结束动画
      if (count >= totalIterations) {
        clearInterval(animationRef.current);
        animationRef.current = null;
        
        // 生成随机最终数字
        const finalIndex = Math.floor(Math.random() * availableNumbersRef.current.length);
        const finalNum = availableNumbersRef.current[finalIndex];
        
        setFinalNumber(finalNum);
        setCurrentNumber(finalNum);
        setAnimationRunning(false);
        setShowConfirmButton(true); // 显示确认按钮而不是自动调用API
      } else {
        // 更新动画间隔
        clearInterval(animationRef.current);
        animationRef.current = setInterval(() => animateDrawing(nextInterval), nextInterval);
      }
    };
    
    // 启动动画
    animationRef.current = setInterval(() => animateDrawing(), 500); // 初始间隔
  };

  // 确认抽奖结果
  const handleConfirmResult = () => {
    if (finalNumber !== null) {
      handleDraw(finalNumber);
    }
  };

  // 执行抽奖 API 调用
  const handleDraw = async (drawnNumber) => {
    if (!lottery.isOpen) {
      setError('该抽奖活动已经结束');
      return;
    }

    // 验证抽奖范围
    if (startNumber >= endNumber) {
      setError('起始数字必须小于结束数字');
      return;
    }

    if (startNumber < 0 || endNumber > 99) {
      setError('抽奖范围必须在0-99之间');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const drawConfig = {
        excludedNumbers: excludedNumbers.length > 0 
          ? excludedNumbers.map(num => num.toString()) 
          : undefined,
        startNumber: startNumber.toString(),
        endNumber: endNumber.toString(),
        fixedResult: drawnNumber ? drawnNumber.toString() : undefined
      };

      console.log('发送抽奖参数:', drawConfig);
      const updatedLottery = await lotteryAPI.drawLottery(lottery._id, drawConfig);
      console.log('获取更新后的彩票:', updatedLottery);
      setLottery(updatedLottery);
      // 重置设置状态
      setShowDrawSettings(false);
    } catch (err) {
      console.error('抽奖失败:', err);
      setError(err.message || '抽奖失败');
    } finally {
      setLoading(false);
    }
  };

  // 渲染备选数字网格
  const renderNumberGrid = () => {
    const numbers = [];
    for (let i = startNumber; i <= endNumber; i++) {
      if (!excludedNumbers.includes(i)) {
        numbers.push(i);
      }
    }
    
    return (
      <NumberGrid>
        {numbers.map(num => (
          <NumberCell 
            key={num}
            active={currentNumber === num}
            highlight={finalNumber === num}
          >
            {num}
          </NumberCell>
        ))}
      </NumberGrid>
    );
  };

  return (
    <DetailContainer>
      {loading && (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      )}
      
      <BackButton onClick={() => {
        if (onBack) {
          // 如果是通过MainContainer渲染的，使用onBack回调
          onBack();
        } else {
          // 如果是通过路由渲染的，使用navigate返回
          navigate('/lottery');
        }
      }}>返回列表</BackButton>
      
      <Title>
        {lottery.title}
        <StatusBadge isOpen={lottery.isOpen}>
          {lottery.isOpen ? '进行中' : '已结束'}
        </StatusBadge>
      </Title>
      
      <Subtitle>基本信息</Subtitle>
      <InfoGrid>
        <InfoGroup>
          <Label>创建日期</Label>
          <Value>{formatDate(lottery.createdAt)}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>开奖日期</Label>
          <Value>{formatDate(lottery.drawDate)}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>奖品</Label>
          <Value>{lottery.prize}</Value>
        </InfoGroup>
        <InfoGroup>
          <Label>参与人数</Label>
          <Value>{lottery.participants ? lottery.participants.length : 0}/{lottery.maxParticipants}</Value>
        </InfoGroup>
      </InfoGrid>
      
      <Subtitle>抽奖说明</Subtitle>
      <div style={{ marginBottom: '1rem' }}>{lottery.description}</div>

      {/* 显示抽奖范围信息 */}
      <ExcludedNumbers style={{ marginBottom: '0.5rem', borderLeft: '3px solid #1890ff', backgroundColor: '#e6f7ff' }}>
        抽奖范围: {showDrawSettings || animationRunning || finalNumber ? startNumber : (lottery.startNumber || '1')} - {showDrawSettings || animationRunning || finalNumber ? endNumber : (lottery.endNumber || '99')}
      </ExcludedNumbers>

      {lottery.excludedNumbers && lottery.excludedNumbers.length > 0 && (
        <ExcludedNumbers>
          排除号码: {lottery.excludedNumbers.join(', ')}
        </ExcludedNumbers>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {lottery.isOpen && !showDrawSettings && !animationRunning && (
        <DrawButton 
          onClick={() => setShowDrawSettings(true)} 
          disabled={loading}
        >
          设置抽奖参数
        </DrawButton>
      )}
      
      {lottery.isOpen && showDrawSettings && !animationRunning && (
        <DrawSettings>
          <Subtitle style={{ marginTop: 0 }}>抽奖设置</Subtitle>
          
          <FormGroup>
            <label>抽奖范围</label>
            <InputRow>
              <Input 
                type="number" 
                placeholder="起始数字" 
                value={startNumber}
                onChange={(e) => setStartNumber(parseInt(e.target.value) || 0)}
                min="0"
                max="98"
                style={{ maxWidth: '120px' }}
              />
              <span style={{ margin: '0 10px' }}>至</span>
              <Input 
                type="number" 
                placeholder="结束数字" 
                value={endNumber}
                onChange={(e) => setEndNumber(parseInt(e.target.value) || 1)}
                min="1"
                max="99"
                style={{ maxWidth: '120px' }}
              />
            </InputRow>
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#999', 
              marginTop: '0.5rem' 
            }}>
              设置抽奖号码的范围，默认为1-99
            </div>
          </FormGroup>
          
          <FormGroup>
            <label>排除数字</label>
            <InputRow>
              <Input 
                type="text" 
                placeholder="输入数字(0-99)，用逗号或空格分隔" 
                value={excludedInput}
                onChange={(e) => setExcludedInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddExcludedNumber()}
                style={{ flex: 1 }}
              />
              <DrawButton 
                onClick={handleAddExcludedNumber}
                style={{ 
                  width: 'auto', 
                  margin: 0,
                  padding: '0.8rem 1rem',
                  minWidth: '80px'
                }}
                disabled={!excludedInput.trim()}
              >
                添加
              </DrawButton>
            </InputRow>
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#999', 
              marginTop: '0.5rem' 
            }}>
              添加的数字将被排除在抽奖结果之外
            </div>
          </FormGroup>
          
          {excludedNumbers.length > 0 && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <label>已排除的数字:</label>
                <button 
                  onClick={() => setExcludedNumbers([])}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff4d4f',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}
                >
                  清空全部
                </button>
              </div>
              <TagGroup>
                {excludedNumbers.map(num => (
                  <Tag key={num}>
                    {num}
                    <button onClick={() => handleRemoveExcludedNumber(num)}>×</button>
                  </Tag>
                ))}
              </TagGroup>
            </div>
          )}
          
          <div style={{ display: 'flex', marginTop: '1.5rem', gap: '1rem' }}>
            <DrawButton 
              onClick={() => setShowDrawSettings(false)}
              style={{ backgroundColor: '#f5f5f5', color: '#666' }}
            >
              取消
            </DrawButton>
            <DrawButton onClick={handleDrawAnimation}>
              开始抽奖
            </DrawButton>
          </div>
        </DrawSettings>
      )}
      
      {animationRunning && (
        <div>
          <DrawAnimationContainer>
            <AnimationNumber isSlowing={isSlowing}>{currentNumber}</AnimationNumber>
            {isSlowing && <Confetti />}
          </DrawAnimationContainer>
          <div style={{ marginTop: '1rem' }}>
            {renderNumberGrid()}
          </div>
        </div>
      )}
      
      {finalNumber && !animationRunning && lottery.isOpen && (
        <FinalResultContainer>
          <ResultLabel>恭喜！抽奖结果为：</ResultLabel>
          <FinalResult>{finalNumber}</FinalResult>
          {showConfirmButton && (
            <DrawButton 
              onClick={handleConfirmResult}
              style={{ marginTop: '1.5rem' }}
            >
              确认结果并保存
            </DrawButton>
          )}
        </FinalResultContainer>
      )}
      
      {!lottery.isOpen && (
        <FinalResultContainer>
          <Subtitle>抽奖结果</Subtitle>
          <FinalResult>{lottery.result}</FinalResult>
          
          {/* 添加抽奖号码显示 */}
          <div style={{ marginTop: '1.5rem' }}>
            <Subtitle>所有备选号码</Subtitle>
            <NumberGrid>
              {(() => {
                // 确保从lottery对象中获取正确的范围值
                const minNum = parseInt(lottery.startNumber) || 1;
                const maxNum = parseInt(lottery.endNumber) || 99;
                
                // 生成指定范围内的数字
                return Array.from(
                  { length: maxNum - minNum + 1 }, 
                  (_, i) => i + minNum
                )
                  .filter(num => {
                    // 确保排除号码是数组
                    const excludedArray = Array.isArray(lottery.excludedNumbers) ? lottery.excludedNumbers : [];
                    // 将数字转为字符串再比较，确保类型匹配
                    return !excludedArray.includes(num.toString()) && !excludedArray.includes(String(num));
                  })
                  .map(num => (
                    <NumberCell 
                      key={num}
                      highlight={lottery.result === num.toString() || lottery.result === String(num)}
                    >
                      {num}
                    </NumberCell>
                  ));
              })()}
            </NumberGrid>
          </div>
        </FinalResultContainer>
      )}
    </DetailContainer>
  );
};

export default LotteryHistoryDetail; 