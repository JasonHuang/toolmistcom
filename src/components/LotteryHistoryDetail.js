import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { lotteryAPI } from '../services/api';

const DetailContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 2.5rem;
  position: relative;
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
  font-size: 1.3rem;
  color: #1a1a1a;
  margin: 2rem 0 1rem;
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
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #fafafa;
    border-radius: 6px;
    padding: 0.5rem;
    margin-left: -0.5rem;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: #666;
  width: 120px;
  flex-shrink: 0;
  font-size: 0.95rem;
`;

const Value = styled.span`
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 500;
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
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #666;
  
  &:before {
    content: '←';
    margin-right: 6px;
    font-size: 1.1rem;
  }
  
  &:hover {
    background-color: #fafafa;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    color: #1a1a1a;
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lotteryRecord, setLotteryRecord] = useState(record);
  const [showDrawSettings, setShowDrawSettings] = useState(false);
  const [startNumber, setStartNumber] = useState(1);
  const [endNumber, setEndNumber] = useState(100);
  const [excludedInput, setExcludedInput] = useState('');
  const [excludedNumbers, setExcludedNumbers] = useState([]);
  const [animationRunning, setAnimationRunning] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [finalNumber, setFinalNumber] = useState(null);
  const [isSlowing, setIsSlowing] = useState(false);
  
  const animationRef = useRef(null);
  const availableNumbersRef = useRef([]);

  useEffect(() => {
    // 清理抽奖动画
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

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

  const handleAddExcludedNumber = () => {
    if (!excludedInput.trim()) return;

    // 支持逗号分隔的多个数字或空格分隔的多个数字
    const inputNumbers = excludedInput
      .split(/[,，\s]+/)
      .map(num => num.trim())
      .filter(num => num !== '')
      .map(num => parseInt(num, 10))
      .filter(num => !isNaN(num));

    if (inputNumbers.length === 0) {
      setError('请输入有效的数字');
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

  const handleRemoveExcludedNumber = (numberToRemove) => {
    setExcludedNumbers(excludedNumbers.filter(num => num !== numberToRemove));
  };

  const handleDrawAnimation = () => {
    if (animationRunning) return;
    
    // 验证输入
    if (startNumber >= endNumber) {
      setError('起始数字必须小于结束数字');
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
    const totalIterations = 50; // 总迭代次数
    const accelerationPhase = 15; // 加速阶段
    const steadyPhase = 25; // 匀速阶段
    
    // 清除之前的动画
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    
    // 创建一个可以递归调用的函数而不是使用arguments.callee
    const animateDrawing = (interval = 200) => {
      count++;
      
      // 获取随机数
      const randomIndex = Math.floor(Math.random() * availableNumbersRef.current.length);
      const number = availableNumbersRef.current[randomIndex];
      setCurrentNumber(number);
      
      // 计算动画间隔 (加速到减速)
      let nextInterval;
      
      if (count < accelerationPhase) {
        // 加速阶段: 从200ms到50ms
        nextInterval = 200 - (150 * count / accelerationPhase);
        setIsSlowing(false);
      } else if (count < accelerationPhase + steadyPhase) {
        // 匀速阶段: 50ms
        nextInterval = 50;
        setIsSlowing(false);
      } else {
        // 减速阶段: 从50ms到500ms
        const deceleration = (count - accelerationPhase - steadyPhase) / (totalIterations - accelerationPhase - steadyPhase);
        nextInterval = 50 + (450 * deceleration);
        setIsSlowing(true); // 进入减速阶段，触发脉动动画
      }
      
      // 结束动画
      if (count >= totalIterations) {
        clearInterval(animationRef.current);
        animationRef.current = null;
        
        // 设置最终数字
        const finalIndex = Math.floor(Math.random() * availableNumbersRef.current.length);
        const finalNum = availableNumbersRef.current[finalIndex];
        setFinalNumber(finalNum);
        setCurrentNumber(finalNum);
        setAnimationRunning(false);
        
        // 延迟后调用API进行真正的抽奖
        setTimeout(() => {
          handleDraw(finalNum);
        }, 1000);
      } else {
        // 更新动画间隔
        clearInterval(animationRef.current);
        animationRef.current = setInterval(() => animateDrawing(nextInterval), nextInterval);
      }
    };
    
    // 启动动画
    animationRef.current = setInterval(() => animateDrawing(), 200); // 初始间隔
  };

  const handleDraw = async (drawnNumber) => {
    if (!lotteryRecord.isOpen || lotteryRecord.participants.length === 0) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // 调用API执行抽奖，传递排除的数字
      const result = await lotteryAPI.drawLottery(lotteryRecord._id, {
        excludedNumbers: excludedNumbers,
        fixedResult: drawnNumber // 传递我们动画抽出的数字作为结果
      });
      
      // 更新本地状态
      setLotteryRecord(result);
    } catch (err) {
      setError('抽奖失败: ' + (err.message || '未知错误'));
      console.error('抽奖失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const canDraw = lotteryRecord.isOpen && lotteryRecord.participants && lotteryRecord.participants.length > 0;

  return (
    <DetailContainer>
      {loading && (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      )}
      
      <BackButton onClick={onBack}>返回列表</BackButton>
      
      <Title>
        {lotteryRecord.title}
        <StatusBadge isOpen={lotteryRecord.isOpen}>
          {lotteryRecord.isOpen ? '进行中' : '已结束'}
        </StatusBadge>
      </Title>
      
      <Subtitle>基本信息</Subtitle>
      <InfoGroup>
        <Label>创建日期</Label>
        <Value>{formatDate(lotteryRecord.createdAt)}</Value>
      </InfoGroup>
      <InfoGroup>
        <Label>抽奖日期</Label>
        <Value>{formatDate(lotteryRecord.drawDate)}</Value>
      </InfoGroup>
      <InfoGroup>
        <Label>奖品</Label>
        <Value>{lotteryRecord.prize}</Value>
      </InfoGroup>
      <InfoGroup>
        <Label>参与人数</Label>
        <Value>{lotteryRecord.participants ? lotteryRecord.participants.length : 0}/{lotteryRecord.maxParticipants}</Value>
      </InfoGroup>
      
      <Subtitle>抽奖说明</Subtitle>
      <div style={{ marginBottom: '1rem' }}>{lotteryRecord.description}</div>
      
      {lotteryRecord.excludedNumbers && lotteryRecord.excludedNumbers.length > 0 && (
        <ExcludedNumbers>
          排除号码: {lotteryRecord.excludedNumbers.join(', ')}
        </ExcludedNumbers>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {lotteryRecord.isOpen && !showDrawSettings && !animationRunning && (
        <DrawButton 
          onClick={() => setShowDrawSettings(true)} 
          disabled={!canDraw || loading}
        >
          设置抽奖参数
        </DrawButton>
      )}
      
      {lotteryRecord.isOpen && showDrawSettings && !animationRunning && (
        <DrawSettings>
          <Subtitle style={{ marginTop: 0 }}>抽奖设置</Subtitle>
          
          <FormGroup>
            <label>数字范围</label>
            <InputRow>
              <Input 
                type="number" 
                placeholder="开始" 
                value={startNumber}
                onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                width="120px"
              />
              <span>至</span>
              <Input 
                type="number" 
                placeholder="结束" 
                value={endNumber}
                onChange={(e) => setEndNumber(parseInt(e.target.value) || 100)}
                width="120px"
              />
            </InputRow>
          </FormGroup>
          
          <FormGroup>
            <label>排除数字</label>
            <InputRow>
              <Input 
                type="text" 
                placeholder="输入数字，用逗号或空格分隔" 
                value={excludedInput}
                onChange={(e) => setExcludedInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddExcludedNumber()}
              />
              <DrawButton 
                onClick={handleAddExcludedNumber}
                style={{ width: 'auto', margin: 0 }}
                disabled={!excludedInput.trim()}
              >
                添加
              </DrawButton>
            </InputRow>
          </FormGroup>
          
          {excludedNumbers.length > 0 && (
            <TagGroup>
              {excludedNumbers.map(num => (
                <Tag key={num}>
                  {num}
                  <button onClick={() => handleRemoveExcludedNumber(num)}>×</button>
                </Tag>
              ))}
            </TagGroup>
          )}
          
          <div style={{ display: 'flex', marginTop: '1rem', gap: '1rem' }}>
            <DrawButton 
              onClick={() => setShowDrawSettings(false)}
              style={{ backgroundColor: '#f5f5f5', color: '#666' }}
            >
              取消
            </DrawButton>
            <DrawButton onClick={handleDrawAnimation}>
              立即开奖
            </DrawButton>
          </div>
        </DrawSettings>
      )}
      
      {animationRunning && (
        <DrawAnimationContainer>
          <AnimationNumber isSlowing={isSlowing}>{currentNumber}</AnimationNumber>
          {isSlowing && <Confetti />}
        </DrawAnimationContainer>
      )}
      
      {finalNumber && !animationRunning && lotteryRecord.isOpen && (
        <FinalResultContainer>
          <ResultLabel>恭喜！抽奖结果为：</ResultLabel>
          <FinalResult>{finalNumber}</FinalResult>
        </FinalResultContainer>
      )}
      
      {!lotteryRecord.isOpen && (
        <FinalResultContainer>
          <Subtitle>抽奖结果</Subtitle>
          <FinalResult>{lotteryRecord.result}</FinalResult>
          <InfoGroup>
            <Label>中奖人</Label>
            <Value>{lotteryRecord.winner}</Value>
          </InfoGroup>
        </FinalResultContainer>
      )}
    </DetailContainer>
  );
};

export default LotteryHistoryDetail; 