import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Navbar from './components/common/Navbar';
import Lectures from './pages/Lectures';
import LiveClasses from './pages/LiveClasses';
import Downloads from './pages/Downloads';
import Faculty from './pages/Faculty';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/lectures" replace />} />
            <Route path="/lectures" element={<Lectures />} />
            <Route path="/live-classes" element={<LiveClasses />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/faculty" element={<Faculty />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;