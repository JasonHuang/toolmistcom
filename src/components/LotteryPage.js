import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import './LotteryPage.css';

const FormContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #4a90e2;
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3a7bc8;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  display: ${props => (props.visible ? 'block' : 'none')};
  position: relative;
  overflow: hidden;
`;

const NumberDisplay = styled.div`
  font-size: 72px;
  font-weight: bold;
  color: #4a90e2;
  margin: 1rem 0;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 0.5rem;
  font-size: 14px;
`;

const ExcludedNumbersDisplay = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ExcludedNumber = styled.span`
  background-color: #f1f1f1;
  color: #333;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  margin-left: 4px;
  cursor: pointer;
  font-size: 14px;
  padding: 0 4px;
  
  &:hover {
    color: #c0392b;
  }
`;

const InfoMessage = styled.div`
  color: #7f8c8d;
  margin-top: 0.5rem;
  font-size: 14px;
`;

const LotteryPage = () => {
  const [startNumber, setStartNumber] = useState('');
  const [endNumber, setEndNumber] = useState('');
  const [excludedInput, setExcludedInput] = useState('');
  const [excludedNumbers, setExcludedNumbers] = useState([]);
  const [result, setResult] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState('');
  const [intervalId, setIntervalId] = useState(null);

  const startNumberRef = useRef(null);
  const endNumberRef = useRef(null);
  const excludedInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const validateInputs = () => {
    if (startNumber === '' || endNumber === '') {
      setError('请输入起始数字和目标数字');
      return false;
    }

    const start = parseInt(startNumber, 10);
    const end = parseInt(endNumber, 10);

    if (isNaN(start) || isNaN(end)) {
      setError('请输入有效的数字');
      return false;
    }

    if (start >= end) {
      setError('起始数字必须小于目标数字');
      return false;
    }

    // 检查可能的范围是否太小
    const availableNumbers = getAvailableNumbers(start, end, excludedNumbers);
    if (availableNumbers.length === 0) {
      setError('排除的数字太多，没有可选的数字了');
      return false;
    }

    setError('');
    return true;
  };

  const getAvailableNumbers = (start, end, excluded) => {
    const allNumbers = [];
    for (let i = start; i <= end; i++) {
      if (!excluded.includes(i)) {
        allNumbers.push(i);
      }
    }
    return allNumbers;
  };

  const getRandomNumberExcluding = (start, end, excluded) => {
    const availableNumbers = getAvailableNumbers(start, end, excluded);
    
    if (availableNumbers.length === 0) {
      return null; // 没有可用的数字
    }
    
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    return availableNumbers[randomIndex];
  };

  const handleDraw = () => {
    if (!validateInputs()) return;

    const start = parseInt(startNumber, 10);
    const end = parseInt(endNumber, 10);

    setIsDrawing(true);
    setResult(null);

    let count = 0;
    const maxCount = 20; // 抽奖动画持续次数
    const animationInterval = 50; // 抽奖动画间隔（毫秒）

    // 清除之前的interval（如果有）
    if (intervalId) {
      clearInterval(intervalId);
    }

    // 创建一个新的interval来执行抽奖动画
    const newIntervalId = setInterval(() => {
      // 生成随机数并展示（排除指定数字）
      const randomNum = getRandomNumberExcluding(start, end, excludedNumbers);
      setResult(randomNum);
      count++;

      // 达到最大次数后停止动画
      if (count >= maxCount) {
        clearInterval(newIntervalId);
        setIntervalId(null);
        
        // 生成最终结果（排除指定数字）
        const finalResult = getRandomNumberExcluding(start, end, excludedNumbers);
        setResult(finalResult);
        setIsDrawing(false);
      }
    }, animationInterval);

    setIntervalId(newIntervalId);
  };

  const handleReset = () => {
    setStartNumber('');
    setEndNumber('');
    setExcludedInput('');
    setResult(null);
    setError('');
    if (startNumberRef.current) startNumberRef.current.focus();
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
    setError('');
    
    if (excludedInputRef.current) {
      excludedInputRef.current.focus();
    }
  };

  const handleRemoveExcludedNumber = (numberToRemove) => {
    setExcludedNumbers(excludedNumbers.filter(num => num !== numberToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddExcludedNumber();
    }
  };

  return (
    <div className="lottery-container">
      <FormContainer>
        <h2>设置抽奖范围</h2>
        <InputGroup>
          <Label htmlFor="startNumber">起始数字</Label>
          <Input
            ref={startNumberRef}
            type="number"
            id="startNumber"
            value={startNumber}
            onChange={(e) => setStartNumber(e.target.value)}
            disabled={isDrawing}
            placeholder="请输入起始数字"
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="endNumber">目标数字</Label>
          <Input
            ref={endNumberRef}
            type="number"
            id="endNumber"
            value={endNumber}
            onChange={(e) => setEndNumber(e.target.value)}
            disabled={isDrawing}
            placeholder="请输入目标数字"
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="excludedNumbers">排除数字</Label>
          <div style={{ display: 'flex' }}>
            <Input
              ref={excludedInputRef}
              type="text"
              id="excludedNumbers"
              value={excludedInput}
              onChange={(e) => setExcludedInput(e.target.value)}
              disabled={isDrawing}
              placeholder="输入要排除的数字，例如：1,2,3"
              onKeyPress={handleKeyPress}
              style={{ flex: 1, marginRight: '8px' }}
            />
            <Button 
              onClick={handleAddExcludedNumber} 
              disabled={isDrawing || !excludedInput.trim()}
              style={{ padding: '0 16px' }}
            >
              添加
            </Button>
          </div>
          <InfoMessage>可输入多个数字，用逗号或空格分隔</InfoMessage>
          
          {excludedNumbers.length > 0 && (
            <ExcludedNumbersDisplay>
              <div style={{ marginRight: '8px', fontWeight: 'bold' }}>已排除：</div>
              {excludedNumbers.map((num) => (
                <ExcludedNumber key={num}>
                  {num}
                  <RemoveButton 
                    onClick={() => handleRemoveExcludedNumber(num)}
                    disabled={isDrawing}
                  >
                    ×
                  </RemoveButton>
                </ExcludedNumber>
              ))}
            </ExcludedNumbersDisplay>
          )}
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="button-group">
          <Button onClick={handleDraw} disabled={isDrawing}>
            {isDrawing ? '抽奖中...' : '开始抽奖'}
          </Button>
          <Button className="reset-button" onClick={handleReset} disabled={isDrawing}>
            重置
          </Button>
        </div>
      </FormContainer>

      <ResultContainer visible={result !== null}>
        <h2>抽奖结果</h2>
        <NumberDisplay>{result}</NumberDisplay>
        <div className="confetti-container">
          {isDrawing && (
            <div className="drawing-animation">
              <div className="spinner"></div>
            </div>
          )}
          {!isDrawing && result !== null && <div className="confetti"></div>}
        </div>
      </ResultContainer>
    </div>
  );
};

export default LotteryPage; 