import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  
  span {
    color: #ff8303;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled.a`
  color: white;
  padding: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ff8303;
  }
`;

const AuthButton = styled.a`
  background-color: #ff8303;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #ffb703;
    transform: translateY(-2px);
  }
`;

function Header() {
  return (
    <HeaderContainer>
      <NavContainer>
        <Logo>
          Tool<span>Mist</span>
        </Logo>
        <NavLinks>
          <NavLink href="/#apps">应用</NavLink>
          <NavLink href="/#features">特点</NavLink>
          <NavLink href="/#about">关于</NavLink>
        </NavLinks>
        <div>
          <AuthButton href="https://auth.toolmist.com">登录 / 注册</AuthButton>
        </div>
      </NavContainer>
    </HeaderContainer>
  );
}

export default Header;