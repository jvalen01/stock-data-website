// src/App.jsx
import React from 'react';
import Header from './components/header/Header'
import StockData from './components/stockData/StockData'

function App() {
  return (
    <div className="App">
      <Header/>
      <StockData />
    </div>
  );
}

export default App;
