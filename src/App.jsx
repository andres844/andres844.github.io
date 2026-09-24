import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Change BrowserRouter to HashRouter
import Resume from './pages/Resume';
import PersonalPage from './pages/PersonalPage';
import GamesPage from './pages/GamesPage';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-amber-400/30 selection:text-amber-200">
        {/* Global scroll progress bar above everything, including navbar */}
        <ScrollProgress />
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Resume />} />
          <Route path="/personal" element={<PersonalPage />} />
          <Route path="/games" element={<GamesPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
// things to update: gather experience title and company as you scroll down, to keep them in view at the top of screen. 
