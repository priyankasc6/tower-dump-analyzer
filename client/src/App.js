import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import Upload from './pages/Upload';
import Correlate from './pages/Correlate';
import './styles/global.css';
import RouteMap from './pages/RouteMap';
import Reports from './pages/Reports';

// inside <Routes>


// inside <Routes>

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/correlate" element={<Correlate />} />
        <Route path="/map" element={<RouteMap />} />
        <Route path="/reports" element={<Reports />} />

      </Routes>
    </Router>
  );
}

export default App;