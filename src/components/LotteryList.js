import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { lotteryAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ListContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #f0f0f0;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  span {
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -0.9rem;
      left: 0;
      width: 3rem;
      height: 3px;
      background: linear-gradient(to right, #ff4d4f, #ff7875);
      border-radius: 3px;
    }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
`;

const FilterLabel = styled.span`
  font-weight: 600;
  color: #666;
  margin-right: 1rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: 1px solid ${props => props.active ? '#ff4d4f' : '#d9d9d9'};
  background-color: ${props => props.active ? 'rgba(255, 77, 79, 0.1)' : 'white'};
  color: ${props => props.active ? '#ff4d4f' : '#666'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(255, 77, 79, 0.15)' : '#f5f5f5'};
    transform: translateY(-2px);
  }
  
  &:last-child {
    margin-right: 0;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  margin-left: auto;
  width: 250px;
  transition: all 0.3s;
  
  &:focus {
    border-color: #40a9ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  
  &::placeholder {
    color: #bfbfbf;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  color: #1a1a1a;
  font-weight: 600;
  font-size: 1rem;
  background-color: #fafafa;
  border-bottom: 2px solid #f0f0f0;
  
  &:first-child {
    border-top-left-radius: 8px;
  }
  
  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const TableRow = styled.tr`
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #fafafa;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #333;
  font-size: 0.95rem;
  
  &:first-child {
    font-weight: 500;
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

const EmptyMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #999;
  font-size: 1rem;
  background-color: #fafafa;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px dashed #d9d9d9;
`;

const ViewButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, #1890ff, #40a9ff);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  
  &:before {
    content: '→';
    margin-right: 6px;
    font-size: 1.1rem;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(to right, #40a9ff, #69c0ff);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    
    &:before {
      transform: translateX(3px);
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.active ? '#ff4d4f' : '#d9d9d9'};
  background-color: ${props => props.active ? 'rgba(255, 77, 79, 0.1)' : 'white'};
  color: ${props => props.active ? '#ff4d4f' : '#666'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(255, 77, 79, 0.15)' : '#f5f5f5'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(24, 144, 255, 0.1);
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 10px rgba(24, 144, 255, 0.2);
  margin: 2rem auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, #ff4d4f, #ff7875);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.2);
  
  &:before {
    content: '×';
    margin-right: 6px;
    font-size: 1.1rem;
    font-weight: bold;
  }
  
  &:hover {
    background: linear-gradient(to right, #ff7875, #ffa39e);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(255, 77, 79, 0.2);
  }
`;

const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.3rem;
  color: #1a1a1a;
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
`;

const ModalText = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  background-color: ${props => props.primary ? '#ff4d4f' : 'white'};
  color: ${props => props.primary ? 'white' : '#666'};
  border: ${props => props.primary ? 'none' : '1px solid #d9d9d9'};
  box-shadow: ${props => props.primary ? 
    '0 4px 12px rgba(255, 77, 79, 0.2)' : 
    '0 2px 6px rgba(0, 0, 0, 0.05)'};
    
  &:hover {
    background-color: ${props => props.primary ? '#ff7875' : '#f9f9f9'};
    box-shadow: ${props => props.primary ? 
      '0 6px 16px rgba(255, 77, 79, 0.3)' : 
      '0 4px 12px rgba(0, 0, 0, 0.1)'};
  }
`;

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

const LotteryList = ({ onRecordSelect }) => {
  const navigate = useNavigate();
  const [lotteries, setLotteries] = useState([]);
  const [filteredLotteries, setFilteredLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'open', 'closed'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // 存储要删除的抽奖ID
  const [deleteLoading, setDeleteLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        setLoading(true);
        const data = await lotteryAPI.getAllLotteries();
        setLotteries(data);
        setFilteredLotteries(data);
        setError(null);
      } catch (err) {
        setError('获取抽奖列表失败，请稍后再试');
        console.error('获取抽奖列表失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLotteries();
  }, []);

  useEffect(() => {
    // 筛选逻辑
    let result = [...lotteries];
    
    // 根据状态筛选
    if (filter === 'open') {
      result = result.filter(lottery => lottery.isOpen === true);
    } else if (filter === 'closed') {
      result = result.filter(lottery => lottery.isOpen === false);
    }
    
    // 搜索筛选
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(lottery => 
        lottery.title.toLowerCase().includes(term) || 
        lottery.prize.toLowerCase().includes(term) ||
        (lottery.winner && lottery.winner.toLowerCase().includes(term))
      );
    }
    
    setFilteredLotteries(result);
    setCurrentPage(1); // 重置为第一页
  }, [filter, searchTerm, lotteries]);

  const handleViewDetails = (record) => {
    if (onRecordSelect) {
      onRecordSelect(record);
    } else {
      navigate(`/lottery/${record._id}`);
    }
  };

  const handleDeleteClick = (record) => {
    setDeleteConfirm(record);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      setDeleteLoading(true);
      await lotteryAPI.deleteLottery(deleteConfirm._id);
      
      // 从列表中移除已删除的抽奖
      const updatedLotteries = lotteries.filter(lottery => lottery._id !== deleteConfirm._id);
      setLotteries(updatedLotteries);
      setFilteredLotteries(
        filteredLotteries.filter(lottery => lottery._id !== deleteConfirm._id)
      );
      
      setDeleteConfirm(null);
    } catch (err) {
      console.error('删除抽奖失败:', err);
      setError('删除抽奖失败: ' + (err.message || '未知错误'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  // 计算分页
  const totalPages = Math.ceil(filteredLotteries.length / itemsPerPage);
  const paginatedLotteries = filteredLotteries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 生成分页按钮
  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || 
      i === totalPages || 
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      paginationButtons.push(
        <PageButton 
          key={i} 
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </PageButton>
      );
    } else if (
      i === currentPage - 2 || 
      i === currentPage + 2
    ) {
      paginationButtons.push(
        <PageButton 
          key={i} 
          disabled
        >
          ...
        </PageButton>
      );
    }
  }

  if (loading) {
    return <ListContainer><Title><span>抽奖列表</span></Title><LoadingSpinner /></ListContainer>;
  }

  if (error) {
    return <ListContainer><Title><span>抽奖列表</span></Title><EmptyMessage>{error}</EmptyMessage></ListContainer>;
  }

  return (
    <ListContainer>
      <Title>
        <span>抽奖列表</span>
      </Title>
      
      <FilterContainer>
        <FilterLabel>状态:</FilterLabel>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          全部
        </FilterButton>
        <FilterButton 
          active={filter === 'open'} 
          onClick={() => setFilter('open')}
        >
          进行中
        </FilterButton>
        <FilterButton 
          active={filter === 'closed'} 
          onClick={() => setFilter('closed')}
        >
          已结束
        </FilterButton>
        
        <SearchInput 
          placeholder="搜索标题或奖品..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FilterContainer>
      
      {filteredLotteries.length > 0 ? (
        <>
          <Table>
            <thead>
              <tr>
                <TableHeader>标题</TableHeader>
                <TableHeader>创建日期</TableHeader>
                <TableHeader>开奖日期</TableHeader>
                <TableHeader>奖品</TableHeader>
                <TableHeader>状态</TableHeader>
                <TableHeader>参与人数</TableHeader>
                <TableHeader>获奖者</TableHeader>
                <TableHeader>操作</TableHeader>
              </tr>
            </thead>
            <tbody>
              {paginatedLotteries.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{record.title}</TableCell>
                  <TableCell>{formatDate(record.createdAt)}</TableCell>
                  <TableCell>{formatDate(record.drawDate)}</TableCell>
                  <TableCell>{record.prize}</TableCell>
                  <TableCell>
                    <StatusBadge isOpen={record.isOpen}>
                      {record.isOpen ? '进行中' : '已结束'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    {record.participants ? record.participants.length : 0}/{record.maxParticipants}
                  </TableCell>
                  <TableCell>{record.winner || '-'}</TableCell>
                  <TableCell>
                    <ButtonGroup>
                      <ViewButton onClick={() => handleViewDetails(record)}>
                        查看详情
                      </ViewButton>
                      <DeleteButton onClick={() => handleDeleteClick(record)}>
                        删除
                      </DeleteButton>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          
          {totalPages > 1 && (
            <Pagination>
              <PageButton 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ←
              </PageButton>
              
              {paginationButtons}
              
              <PageButton 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                →
              </PageButton>
            </Pagination>
          )}
        </>
      ) : (
        <EmptyMessage>
          {searchTerm ? '没有找到匹配的抽奖记录' : '暂无抽奖记录'}
        </EmptyMessage>
      )}
      
      {deleteConfirm && (
        <ConfirmModal>
          <ModalContent>
            <ModalTitle>确认删除</ModalTitle>
            <ModalText>
              您确定要删除抽奖 "{deleteConfirm.title}" 吗？此操作不可撤销。
            </ModalText>
            <ModalButtons>
              <ModalButton onClick={handleCancelDelete}>取消</ModalButton>
              <ModalButton 
                primary 
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? '删除中...' : '确认删除'}
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ConfirmModal>
      )}
    </ListContainer>
  );
};

export default LotteryList; 