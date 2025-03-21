import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import NotFound from './components/NotFound';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Poppins', sans-serif;
    background: #f9f9f9;
    color: #333;
    line-height: 1.6;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <AppContainer>
          <Header />
          <MainContent>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainContent>
          <Footer />
        </AppContainer>
      </BrowserRouter>
    </>
  );
}

export default App;
