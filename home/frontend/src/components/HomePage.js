import React from 'react';
import styled from 'styled-components';
import AppCard from './AppCard';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  
  span {
    color: #ff8303;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const AppSection = styled.section`
  padding: 5rem 2rem;
  background: #f9f9f9;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #1a1a2e;
  
  &:after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: #ff8303;
    margin: 1rem auto;
    border-radius: 4px;
  }
`;

const AppsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeaturesSection = styled.section`
  padding: 5rem 2rem;
  background: white;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 20px rgba(0,0,0,0.1);
  }
  
  h3 {
    margin: 1rem 0;
    color: #1a1a2e;
  }
  
  p {
    color: #666;
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff8303;
  font-size: 2rem;
`;

function HomePage() {
  const apps = [
    {
      id: 1,
      title: "抽奖系统",
      description: "创建和管理在线抽奖活动，支持多种抽奖模式和自定义设置。",
      icon: "🎯",
      url: "https://lottery.toolmist.com",
      color: "#ff8303"
    },
    {
      id: 2,
      title: "黄金系统",
      description: "黄金价格追踪和交易模拟工具，提供历史数据分析和趋势预测。",
      icon: "💰",
      url: "https://gold.toolmist.com",
      color: "#ffc107"
    },
    {
      id: 3,
      title: "待开发",
      description: "更多实用工具即将推出，敬请期待！",
      icon: "🔜",
      url: "#",
      color: "#4caf50"
    }
  ];
  
  const features = [
    {
      icon: "🔐",
      title: "统一账户系统",
      description: "一次注册，畅享所有工具，数据同步无忧。"
    },
    {
      icon: "🚀",
      title: "高性能体验",
      description: "优化的性能和响应速度，让您的操作更加流畅。"
    },
    {
      icon: "📱",
      title: "全设备适配",
      description: "无论是电脑、平板还是手机，都能获得一致的优质体验。"
    },
    {
      icon: "🛡️",
      title: "安全可靠",
      description: "严格的数据加密和安全措施，保护您的信息安全。"
    }
  ];

  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle>欢迎来到 <span>ToolMist</span> 平台</HeroTitle>
          <HeroSubtitle>一站式工具集合，提升您的工作效率和创造力</HeroSubtitle>
        </HeroContent>
      </HeroSection>
      
      <AppSection id="apps">
        <SectionTitle>我们的应用</SectionTitle>
        <AppsGrid>
          {apps.map(app => (
            <AppCard key={app.id} {...app} />
          ))}
        </AppsGrid>
      </AppSection>
      
      <FeaturesSection id="features">
        <SectionTitle>平台特点</SectionTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>
    </>
  );
}

export default HomePage;
