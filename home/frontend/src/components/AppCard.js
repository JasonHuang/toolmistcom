import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.15);
  }
`;

const CardHeader = styled.div`
  background-color: ${props => props.color || '#ff8303'};
  color: white;
  padding: 2rem;
  text-align: center;
`;

const AppIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const CardBody = styled.div`
  padding: 2rem;
  text-align: center;
`;

const AppTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const AppDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const AppButton = styled.a`
  display: inline-block;
  background-color: ${props => props.color || '#ff8303'};
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

function AppCard({ title, description, icon, url, color }) {
  return (
    <Card>
      <CardHeader color={color}>
        <AppIcon>{icon}</AppIcon>
      </CardHeader>
      <CardBody>
        <AppTitle>{title}</AppTitle>
        <AppDescription>{description}</AppDescription>
        <AppButton href={url} color={color}>访问应用</AppButton>
      </CardBody>
    </Card>
  );
}

export default AppCard;
