import React from 'react';
import LotteryPage from './components/LotteryPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>幸运抽奖</h1>
      </header>
      <main>
        <LotteryPage />
      </main>
      <footer className="App-footer">
        <p>© {new Date().getFullYear()} 数字抽奖应用</p>
      </footer>
    </div>
  );
}

export default App; 