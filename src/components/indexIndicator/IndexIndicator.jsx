import React, { useState, useEffect } from 'react';
import './indexIndicator.css';
import { Link } from 'react-router-dom';

function IndexIndicator() {
  const [dataQQQ, setdataQQQ] = useState(null);
  const [dataSPY, setDataSPY] = useState(null);
  const [dataIWM, setdataIWM] = useState(null);

  const STOCK_SYMBOL_1 = 'QQQ';
  const STOCK_SYMBOL_2 = 'SPY';
  const STOCK_SYMBOL_3 = 'IWM';

  const API_KEY = process.env.REACT_APP_API_KEY;;

  const date = new Date();
  const today = new Date(date);
  const twentyDaysAgo = new Date(date);
  today.setDate(today.getDate() - 1); // Go back 20 days
  twentyDaysAgo.setDate(today.getDate() - 31); // Go back 20 days

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const startDateStr = formatDate(twentyDaysAgo);
  const endDateStr = formatDate(today);
  
  const URL1 = `https://api.polygon.io/v2/aggs/ticker/${STOCK_SYMBOL_1}/range/1/day/${startDateStr}/${endDateStr}?apiKey=${API_KEY}`;
  const URL2 = `https://api.polygon.io/v2/aggs/ticker/${STOCK_SYMBOL_2}/range/1/day/${startDateStr}/${endDateStr}?apiKey=${API_KEY}`;
  const URL3 = `https://api.polygon.io/v2/aggs/ticker/${STOCK_SYMBOL_3}/range/1/day/${startDateStr}/${endDateStr}?apiKey=${API_KEY}`;
  
  
  

  //Fetching data from API
  const fetchData = async (url, setData) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);  // add this line
      setData(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
 };

  
  useEffect(() => {
    fetchData(URL1, setdataQQQ);
    fetchData(URL2, setDataSPY);
    fetchData(URL3, setdataIWM);
  }, []);

  const calculateAverages = (data) => {
    const timeSeries = data && data.results;
    let tenDayAverage = 0;
    let twentyDayAverage = 0;

    if (timeSeries && timeSeries.length >= 20) { 
      const last20days = timeSeries.slice(-20); // Get the latest 20 days
      for (let i = 0; i < 10; i++) {
        tenDayAverage += last20days[i].c; // Closing price
      }
      tenDayAverage /= 10;

      for (let i = 0; i < 20; i++) {
        twentyDayAverage += last20days[i].c;
      }
      twentyDayAverage /= 20;
    }

    return { tenDayAverage, twentyDayAverage, timeSeries };
};



  const renderStockData = (data, stockSymbol) => {
    
    const { tenDayAverage, twentyDayAverage, timeSeries } = calculateAverages(data);
    const mostRecentClose = timeSeries && timeSeries[0].c;
    const isTenAboveTwenty = tenDayAverage > twentyDayAverage;
    if (!tenDayAverage || !twentyDayAverage || !timeSeries) return null;

    return (
      <article className="table__index">
        <h1>{stockSymbol}</h1>
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
        }</p>
      </article>
    );
  };

  if (!dataQQQ || !dataSPY || !dataIWM) return <p>Loading...</p>;

  const totalGreenChecks = () => {
    const stocksData = [dataQQQ, dataSPY, dataIWM];
    let totalChecks = 0;
  
    stocksData.forEach(stockData => {
      const { tenDayAverage, twentyDayAverage, timeSeries } = calculateAverages(stockData);
      const mostRecentClose = timeSeries && timeSeries[0].c;
      if (mostRecentClose > tenDayAverage) totalChecks++;
      if (mostRecentClose > twentyDayAverage) totalChecks++;
      if (tenDayAverage > twentyDayAverage) totalChecks++;
    });
  
    return totalChecks;
  };


  return (
    <section id='index'>
      <h2>Market Condition Indicator</h2>
      <div className="container index__container">
        <div className="table__indexes">
          <article className='table__index'>
            {renderStockData(dataQQQ, STOCK_SYMBOL_1)}
          </article>
          <article className='table__index'>
            {renderStockData(dataSPY, STOCK_SYMBOL_2)}
          </article>
          <article className='table__index'>
            {renderStockData(dataIWM, STOCK_SYMBOL_3)}
          </article>
        </div>
        <div className="trade__decision">
          <h2>Can I trade today?</h2>
          <p>{totalGreenChecks() >= 6 ? 'Yes. Market conditions look good:)' : 'No. Best to stay out of the market today.'}</p>
        </div>
      </div>
    </section>
  );
}

export default IndexIndicator;
