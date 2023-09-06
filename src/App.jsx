// src/App.jsx
import React from 'react';
import Header from './components/header/Header'

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from 'react-router-dom';

import IndexIndicator from './components/indexIndicator/IndexIndicator'; // Assuming IndexIndicator is already there.
import SectorIndicator from './components/sectorIndicator/SectorIndicator'; // Assuming SectorIndicator is already there.


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <IndexIndicator/>
        <SectorIndicator/>
      </div>
    </Router>
  );
}

export default App;


