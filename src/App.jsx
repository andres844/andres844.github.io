import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Change BrowserRouter to HashRouter
import Resume from './pages/Resume';
import PersonalPage from './pages/PersonalPage';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 text-white">
        {/* Global scroll progress bar above everything, including navbar */}
        <ScrollProgress />
        <ScrollToTop />
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
// things to update: gather experience title and company as you scroll down, to keep them in view at the top of screen. 
