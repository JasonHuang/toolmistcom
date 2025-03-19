import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { lotteryAPI } from '../services/api';
import { imageAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

// 主容器样式
const PageContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
  }
`;

// 页面标题区
const PageHeader = styled.div`
  padding: 1.8rem 2rem;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #fff8f0 0%, #fff 100%);
`;

const Title = styled.h1`
  color: #1a1a1a;
  margin-bottom: 0.6rem;
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

// 标签页导航区
const TabsNav = styled.div`
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 2rem;
  background-color: #fafafa;
`;

const TabButton = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: ${props => props.$active ? '600' : '400'};
  color: ${props => props.$active ? '#ff4d4f' : '#666'};
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.$active ? '#ff4d4f' : 'transparent'};
    transition: all 0.3s ease;
  }
  
  &:hover {
    color: ${props => !props.$active && '#ff7875'};
  }
`;

// 表单容器
const FormContainer = styled.div`
  padding: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed #f0f0f0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const FormColumn = styled.div`
  flex: 1;
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
  padding: 0.7rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  width: 100%;
  
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
  padding: 0.7rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  width: 100%;
  
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

const DateButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const DateButton = styled.button`
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #ff4d4f;
    color: #ff4d4f;
  }
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

// 添加图片上传组件样式
const ImageUploader = styled.div`
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  background-color: #fafafa;
  width: 300px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  
  &:hover {
    border-color: #40a9ff;
    background-color: #f0f7ff;
  }
  
  input {
    display: none;
  }
`;

const AddIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: #999;
  }
  
  &::before {
    width: 16px;
    height: 2px;
  }
  
  &::after {
    width: 2px;
    height: 16px;
  }
`;

const UploadText = styled.div`
  color: #666;
  font-size: 14px;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }
  
  .preview-btn {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  &:hover .remove-btn,
  &:hover .preview-btn {
    opacity: 1;
  }
`;

// 添加图片预览模态窗口样式
const ImagePreviewModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: zoom-out;
  
  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    border: 2px solid white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }
  
  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 24px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.4);
      transform: scale(1.1);
    }
  }
`;

const UploadProgress = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${props => props.progress}%;
  height: 4px;
  background: linear-gradient(to right, #1890ff, #52c41a);
  transition: width 0.3s ease;
`;

// 设置默认表单数据
const initialFormData = {
  title: '',
  startDate: new Date().toISOString().split('T')[0], // 默认为当前日期
  endDate: new Date().toISOString().split('T')[0], // 默认为当前日期
  prize: '',
  prizeImage: '',  // 新增奖品图片字段
  maxParticipants: 50,
  drawDate: new Date().toISOString().split('T')[0], // 默认为当前日期
  description: '',
  isImmediateDraw: false,
  customRangeEnabled: true,  // 默认选中
  startNumber: '1',
  endNumber: '50'  // 默认结束数字为50
};

const LotteryPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 添加图片上传相关状态
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  
  // 标签页状态
  const [activeTab, setActiveTab] = useState('basic'); // basic, settings, advanced
  
  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // 对于复选框，使用checked值；对于其他输入，使用value
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
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

    // 如果正在上传图片，等待上传完成
    if (isUploading) {
      setError('请等待图片上传完成');
      setLoading(false);
      return;
    }

    // 如果不是立即开奖，还需要验证抽奖日期
    if (!formData.isImmediateDraw && !formData.drawDate) {
      setError('请选择抽奖日期');
      setLoading(false);
      return;
    }

    // 额外的日期验证逻辑
    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const drawDate = new Date(formData.drawDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 确保日期有效
      if (isNaN(startDate) || isNaN(endDate) || isNaN(drawDate)) {
        setError('请输入有效的日期');
        setLoading(false);
        return;
      }

      // 确保结束日期不早于开始日期
      if (endDate < startDate) {
        setError('结束日期不能早于开始日期');
        setLoading(false);
        return;
      }

      // 确保开奖日期不早于开始日期
      if (drawDate < startDate) {
        setError('开奖日期不能早于活动开始日期');
        setLoading(false);
        return;
      }

      // 格式化日期为 YYYY-MM-DD 格式
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      // 如果是立即开奖模式，使用今天的日期
      const formattedDrawDate = formData.isImmediateDraw 
        ? formatDate(today) 
        : formatDate(drawDate);

      try {
        // 构建请求数据
        const lotteryData = {
          title: formData.title,
          description: formData.description,
          prize: formData.prize,
          prizeImage: formData.prizeImage, 
          drawDate: formattedDrawDate,
          maxParticipants: parseInt(formData.maxParticipants) || 50,
          isOpen: true,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          isImmediateDraw: formData.isImmediateDraw,
          startNumber: formData.customRangeEnabled ? formData.startNumber : '1',
          endNumber: formData.customRangeEnabled ? formData.endNumber : '50'
        };

        console.log('Sending lottery data:', lotteryData);
        const response = await lotteryAPI.createLottery(lotteryData);
        console.log('Server response:', response);

        setSuccess('抽奖创建成功！');
        
        // 如果是立即开奖，直接跳转到详情页
        if (formData.isImmediateDraw && response._id) {
          navigate(`/lottery/${response._id}`, { replace: true });
        } else if (response._id) {
          // 普通抽奖创建成功，重置表单并跳转到列表页
          setFormData(initialFormData);
          setImageFile(null);
          setImagePreview('');
          setUploadProgress(0);
          
          // 短暂延迟以便用户看到成功消息
          setTimeout(() => {
            navigate('/lottery', { replace: true });
          }, 1500);
        }
      } catch (err) {
        console.error('Error creating lottery:', err);
        setError(err.message || '创建抽奖失败');
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('Date validation error:', error);
      setError('日期格式错误，请检查输入的日期');
      setLoading(false);
    }
  };
  
  // 处理图片上传
  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.match('image.*')) {
      setError('请选择图片文件');
      return;
    }
    
    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setImagePreview(result);
      
      // 立即更新formData中的prizeImage，而不是等待模拟上传完成
      setFormData(prev => ({
        ...prev,
        prizeImage: result
      }));
    };
    reader.readAsDataURL(file);
    
    // 保存文件
    setImageFile(file);
    
    // 模拟上传过程
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // 使用模拟进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          // 只模拟到90%，最后10%在真正上传完成后设置
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // 在实际项目中，这里应该调用真实的上传API
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setIsUploading(false);
      }, 2000);
      
    } catch (err) {
      setError(`图片上传失败: ${err.message || '未知错误'}`);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>创建抽奖活动</Title>
        <Subtitle>填写以下信息创建一个新的抽奖活动，带 * 的是必填项</Subtitle>
      </PageHeader>
      
      <TabsNav>
        <TabButton 
          $active={activeTab === 'basic'} 
          onClick={() => setActiveTab('basic')}
        >
          基本信息
        </TabButton>
        <TabButton 
          $active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
        >
          抽奖设置
        </TabButton>
        <TabButton 
          $active={activeTab === 'advanced'} 
          onClick={() => setActiveTab('advanced')}
        >
          高级选项
        </TabButton>
      </TabsNav>
      
      <form onSubmit={(e) => {
        // 只有在高级选项页面且点击提交按钮时才处理表单提交
        if (activeTab !== 'advanced') {
          e.preventDefault();
          return false;
        }
        handleSubmit(e);
      }}>
        <FormContainer>
          {/* 基本信息选项卡 */}
          {activeTab === 'basic' && (
            <>
              <SectionTitle>抽奖活动基本信息</SectionTitle>
              
              <FormGroup>
                <Label required>活动标题</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="例如：新年特别抽奖"
                />
              </FormGroup>
              
              <FormRow>
                <FormColumn>
                  <Label required>奖品</Label>
                  <Input
                    type="text"
                    name="prize"
                    value={formData.prize}
                    onChange={handleInputChange}
                    placeholder="例如：iPhone 15 Pro"
                  />
                </FormColumn>
                
                <FormColumn>
                  <Label required>最大参与人数</Label>
                  <Input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="1"
                  />
                </FormColumn>
              </FormRow>
              
              <FormGroup>
                <Label>奖品图片</Label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ImageUploader onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                    
                    {!imagePreview ? (
                      <>
                        <AddIcon />
                        <UploadText>点击上传图片</UploadText>
                      </>
                    ) : (
                      <ImagePreview>
                        <img src={imagePreview} alt="奖品预览" />
                        <button 
                          className="remove-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFile(null);
                            setImagePreview('');
                            setUploadProgress(0);
                            setIsUploading(false);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                        >
                          ×
                        </button>
                        <button 
                          className="preview-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalOpen(true);
                          }}
                        >
                          查看大图
                        </button>
                      </ImagePreview>
                    )}
                    
                    {isUploading && <UploadProgress progress={uploadProgress} />}
                  </ImageUploader>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#999' }}>
                  上传奖品图片，将在抽奖详情中显示
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label required>活动描述</Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="请详细描述本次抽奖活动的规则、奖品详情等信息..."
                />
              </FormGroup>
            </>
          )}
          
          {/* 抽奖设置选项卡 */}
          {activeTab === 'settings' && (
            <>
              <SectionTitle>抽奖时间与方式设置</SectionTitle>
              
              <FormRow>
                <FormColumn>
                  <Label required>开始日期</Label>
                  <Input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </FormColumn>
                
                <FormColumn>
                  <Label required>结束日期</Label>
                  <Input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </FormColumn>
              </FormRow>
              
              <FormGroup>
                <CheckboxContainer>
                  <Checkbox 
                    type="checkbox" 
                    id="isImmediateDraw"
                    name="isImmediateDraw"
                    checked={formData.isImmediateDraw}
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      setFormData(prev => ({
                        ...prev,
                        [name]: checked,
                        drawDate: checked ? new Date().toISOString().split('T')[0] : prev.drawDate
                      }));
                    }}
                  />
                  <CheckboxLabel htmlFor="isImmediateDraw">
                    立即开奖模式
                  </CheckboxLabel>
                </CheckboxContainer>
                
                {formData.isImmediateDraw && (
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#ff4d4f',
                    marginTop: '0.5rem',
                    padding: '0.7rem',
                    background: '#fff1f0',
                    borderRadius: '6px',
                    border: '1px dashed #ffa39e'
                  }}>
                    立即开奖模式下，创建成功后将自动开奖，开奖日期将设为今天
                  </div>
                )}
              </FormGroup>
              
              {!formData.isImmediateDraw && (
                <FormGroup>
                  <Label required>开奖日期</Label>
                  <Input
                    type="date"
                    name="drawDate"
                    value={formData.drawDate}
                    onChange={handleInputChange}
                    min={formData.startDate}
                  />
                  <DateButtonGroup>
                    <DateButton 
                      type="button" 
                      onClick={() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        setFormData(prev => ({
                          ...prev,
                          drawDate: today.toISOString().split('T')[0]
                        }));
                      }}
                    >
                      今天开奖
                    </DateButton>
                    <DateButton 
                      type="button" 
                      onClick={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 7);
                        setFormData(prev => ({
                          ...prev,
                          drawDate: date.toISOString().split('T')[0]
                        }));
                      }}
                    >
                      7天后
                    </DateButton>
                    <DateButton 
                      type="button" 
                      onClick={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 15);
                        setFormData(prev => ({
                          ...prev,
                          drawDate: date.toISOString().split('T')[0]
                        }));
                      }}
                    >
                      15天后
                    </DateButton>
                    <DateButton 
                      type="button" 
                      onClick={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 30);
                        setFormData(prev => ({
                          ...prev,
                          drawDate: date.toISOString().split('T')[0]
                        }));
                      }}
                    >
                      30天后
                    </DateButton>
                  </DateButtonGroup>
                </FormGroup>
              )}
            </>
          )}
          
          {/* 高级选项选项卡 */}
          {activeTab === 'advanced' && (
            <>
              <SectionTitle>高级抽奖设置</SectionTitle>
              
              <FormGroup>
                <CheckboxContainer>
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
              </FormGroup>
              
              <FormRow>
                <FormColumn>
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
                </FormColumn>
                
                <FormColumn>
                  <Label>结束数字</Label>
                  <Input
                    type="number"
                    name="endNumber"
                    value={formData.endNumber}
                    onChange={handleInputChange}
                    min={parseInt(formData.startNumber) + 1}
                    disabled={!formData.customRangeEnabled}
                    style={{
                      backgroundColor: !formData.customRangeEnabled ? '#f5f5f5' : 'white',
                      cursor: !formData.customRangeEnabled ? 'not-allowed' : 'pointer'
                    }}
                  />
                </FormColumn>
              </FormRow>
              
              {!formData.customRangeEnabled && (
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#999',
                  marginTop: '0.5rem' 
                }}>
                  默认抽奖范围: 1 - 50
                </div>
              )}
            </>
          )}
          
          {/* 错误和成功消息 */}
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}
          
          {success && (
            <SuccessMessage>
              {success}
            </SuccessMessage>
          )}
          
          {/* 按钮区域 - 固定在底部 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            borderTop: '1px solid #f0f0f0',
            paddingTop: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <div>
              <Button 
                type="button" 
                onClick={() => {
                  setFormData(initialFormData);
                  setImageFile(null);
                  setImagePreview('');
                  setUploadProgress(0);
                  setIsUploading(false);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                重置
              </Button>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              {activeTab !== 'basic' && (
                <Button 
                  type="button" 
                  onClick={() => setActiveTab(activeTab === 'settings' ? 'basic' : 'settings')}
                >
                  上一步
                </Button>
              )}
              
              {activeTab !== 'advanced' ? (
                <Button 
                  type="button" 
                  primary
                  onClick={(e) => {
                    e.preventDefault(); // 防止事件冒泡
                    setActiveTab(activeTab === 'basic' ? 'settings' : 'advanced');
                  }}
                >
                  下一步
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  primary
                  disabled={loading || isUploading}
                >
                  {loading ? '创建中...' : (isUploading ? '等待图片上传...' : '提交创建')}
                </Button>
              )}
            </div>
          </div>
        </FormContainer>
      </form>
      
      {/* 图片预览模态窗口 */}
      <ImagePreviewModal 
        isOpen={previewModalOpen}
        onClick={() => setPreviewModalOpen(false)}
      >
        {imagePreview && <img src={imagePreview} alt="奖品大图预览" />}
        <button 
          className="close-btn"
          onClick={() => setPreviewModalOpen(false)}
        >
          ×
        </button>
      </ImagePreviewModal>
      
    </PageContainer>
  );
};

export default LotteryPage; 