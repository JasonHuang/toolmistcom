import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainContainer from './components/MainContainer';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap');
 
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans SC', sans-serif;
    background-color: #f5f7fa;
    color: #333;
    line-height: 1.6;
  }

  a {
    color: #1890ff;
    text-decoration: none;
    transition: color 0.3s;
    
    &:hover {
      color: #40a9ff;
    }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
`;

const Header = styled.header`
  background: linear-gradient(90deg, #1a1a1a, #2c2c2c);
  color: white;
  padding: 1.2rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff4d4f, #ff7875);
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  
  &::before {
    content: '🎲';
    margin-right: 0.8rem;
    font-size: 2rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled.a`
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.3s;
  
  &:hover {
    color: white;
    
    &::after {
      width: 100%;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #ff4d4f;
    transition: width 0.3s ease;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem 2rem;
`;

const Footer = styled.footer`
  background-color: #1a1a1a;
  color: rgba(255, 255, 255, 0.6);
  padding: 2rem 0;
  margin-top: 3rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  transition: color 0.3s;
  
  &:hover {
    color: white;
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  text-align: center;
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <HeaderContent>
            <Logo>幸运抽奖系统</Logo>
            <Nav>
              <NavLink href="/">首页</NavLink>
              <NavLink href="/lottery">抽奖活动</NavLink>
              <NavLink href="/history">历史记录</NavLink>
              <NavLink href="/about">关于我们</NavLink>
            </Nav>
          </HeaderContent>
        </Header>
        
        <Main>
          <Routes>
            <Route path="/" element={<MainContainer defaultTab="create" />} />
            <Route path="/lottery" element={<MainContainer defaultTab="list" />} />
            <Route path="/lottery/create" element={<MainContainer defaultTab="create" />} />
            <Route path="/lottery/:id" element={<MainContainer showDetails={true} />} />
          </Routes>
        </Main>
        
        <Footer>
          <FooterContent>
            <FooterLinks>
              <FooterLink href="#">隐私政策</FooterLink>
              <FooterLink href="#">使用条款</FooterLink>
              <FooterLink href="#">联系我们</FooterLink>
              <FooterLink href="#">帮助中心</FooterLink>
            </FooterLinks>
            <Copyright>© {new Date().getFullYear()} 幸运抽奖系统. 保留所有权利.</Copyright>
          </FooterContent>
        </Footer>
      </AppContainer>
    </Router>
  );
}

export default App; 