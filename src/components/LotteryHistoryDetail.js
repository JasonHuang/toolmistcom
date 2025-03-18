import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { lotteryAPI } from '../services/api';

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

const DrawButton = styled.button`
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1.5rem;
  width: 100%;

  &:hover {
    background-color: #ff7875;
  }

  &:disabled {
    background-color: #bfbfbf;
    cursor: not-allowed;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 8px;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
  border-radius: 4px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 1rem;
  width: ${props => props.width || '100%'};
  
  &:focus {
    border-color: #40a9ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const DrawSettings = styled.div`
  background-color: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  button {
    background: none;
    border: none;
    color: #999;
    margin-left: 4px;
    cursor: pointer;
    font-size: 14px;
    padding: 0 2px;
    
    &:hover {
      color: #ff4d4f;
    }
  }
`;

const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const DrawAnimationContainer = styled.div`
  width: 100%;
  height: 120px;
  background-color: #fff1f0;
  border-radius: 8px;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 20px rgba(255, 77, 79, 0.3);
  border: 2px solid #ffa39e;
`;

const AnimationNumber = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: #ff4d4f;
  text-shadow: 0 0 10px rgba(255, 77, 79, 0.5);
  animation: ${props => props.isSlowing ? 'pulse 0.5s infinite' : 'none'};
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
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
      radial-gradient(circle, #ff4d4f 1px, transparent 1px),
      radial-gradient(circle, #1890ff 1px, transparent 1px),
      radial-gradient(circle, #52c41a 1px, transparent 1px),
      radial-gradient(circle, #faad14 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px, 15px 5px, 5px 15px;
    animation: confettiFall 3s linear infinite;
  }
  
  @keyframes confettiFall {
    0% {
      transform: translateY(-10%);
    }
    100% {
      transform: translateY(100%);
    }
  }
`;

const FinalResultContainer = styled.div`
  position: relative;
  margin: 2rem 0;
  animation: fadeIn 0.5s ease-in;
  
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
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    animation: shine 2s infinite;
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
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff4d4f;
  margin-bottom: 1rem;
  animation: bounce 1s ease infinite;
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
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