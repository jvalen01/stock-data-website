// src/StockData.jsx
import React, { useState, useEffect } from 'react';
import './stockData.css';

function StockData() {
  const [data, setData] = useState(null);
  const API_KEY = 'U4U30MIO5AIJ8HCK'; 
  const STOCK_SYMBOL = 'MSFT';  // For example, Apple Inc.
  const URL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${STOCK_SYMBOL}&apikey=${API_KEY}`;


  useEffect(() => {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setData(data);
        })
        .catch(error => console.error('Error fetching stock data:', error));
}, []);

  if (!data) return <p>Loading...</p>;

  const timeSeries = data && data['Time Series (Daily)'];
  let tenDayAverage = 0;
  let twentyDayAverage = 0;

  if (timeSeries) {
    const dates = Object.keys(timeSeries).slice(0, 20); // Get the latest 20 dates
    
    // Calculate 10-day average
    for (let i = 0; i < 10; i++) {
      tenDayAverage += parseFloat(timeSeries[dates[i]]['4. close']);
    }
    tenDayAverage /= 10;
    
    // Calculate 20-day average
    for (let i = 0; i < 20; i++) {
      twentyDayAverage += parseFloat(timeSeries[dates[i]]['4. close']);
    }
    twentyDayAverage /= 20;
  }
  
  const mostRecentClose = timeSeries && parseFloat(timeSeries[Object.keys(timeSeries)[0]]['4. close']);
  const isTenAboveTwenty = tenDayAverage > twentyDayAverage;

  
  return (
    <section id='stockData'>
      <h2>Market indicator for {STOCK_SYMBOL}</h2>
      <div className="container stockData__container">
        <h1>{STOCK_SYMBOL}</h1>
        <p>Most Recent Close: {mostRecentClose}</p>
        <p>Price Above 10EMA: {mostRecentClose > tenDayAverage ? 
          <span className="green-check">✔</span> : 
          <span className="red-cross">✖</span>
        }</p>
        
        <p>Price Above 20EMA: {mostRecentClose > twentyDayAverage ? 
          <span className="green-check">✔</span> : 
          <span className="red-cross">✖</span>
        }</p>

        <p>10EMA above 20EMA: 
          {isTenAboveTwenty ? 
          <span className="green-check">✔</span> : 
          <span className="red-cross">✖</span>
        }
        </p>
     

      </div>
    </section>
  );
}

export default StockData;
