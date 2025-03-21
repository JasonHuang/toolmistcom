import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: #1a1a2e;
  color: white;
  padding: 3rem 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -0.5rem;
      width: 50px;
      height: 2px;
      background: #ff8303;
    }
  }
  
  ul {
    list-style: none;
  }
  
  li {
    margin-bottom: 0.8rem;
  }
  
  a {
    color: #ccc;
    transition: all 0.3s ease;
    
    &:hover {
      color: #ff8303;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  color: #999;
  
  a {
    color: #ff8303;
  }
`;

function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>关于我们</h3>
          <p style={{color: '#ccc', lineHeight: 1.8}}>
            ToolMist 平台提供一系列高效工具，帮助用户提升工作效率和创造力。
          </p>
        </FooterSection>
        
        <FooterSection>
          <h3>应用</h3>
          <ul>
            <li><a href="https://lottery.toolmist.com">抽奖系统</a></li>
            <li><a href="https://gold.toolmist.com">黄金系统</a></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h3>帮助</h3>
          <ul>
            <li><a href="/faq">常见问题</a></li>
            <li><a href="/terms">使用条款</a></li>
            <li><a href="/privacy">隐私政策</a></li>
            <li><a href="/contact">联系我们</a></li>
          </ul>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        &copy; {year} ToolMist 平台。保留所有权利。
      </Copyright>
    </FooterContainer>
  );
}

export default Footer;
