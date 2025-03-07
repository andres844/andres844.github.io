import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Resume from './pages/Resume';
import PersonalPage from './pages/PersonalPage';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Resume />} />
          <Route path="/personal" element={<PersonalPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

