import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 5rem 2rem;
`;

const NotFoundTitle = styled.h1`
  font-size: 6rem;
  margin-bottom: 1rem;
  color: #ff8303;
`;

const NotFoundText = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #555;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  background-color: #ff8303;
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #e67300;
    transform: translateY(-2px);
  }
`;

function NotFound() {
  return (
    <NotFoundContainer>
      <NotFoundTitle>404</NotFoundTitle>
      <NotFoundText>很抱歉，您访问的页面不存在</NotFoundText>
      <HomeButton to="/">返回首页</HomeButton>
    </NotFoundContainer>
  );
}

export default NotFound;
