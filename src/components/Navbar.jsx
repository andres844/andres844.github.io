import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated classes so text is always fully opaque white.
  const baseBtn = 'glass-card hover-change px-4 py-2 rounded-lg text-white transition-all';
  const activeClasses = `${baseBtn} ring-1 ring-blue-400/40`;
  const inactiveClasses = `${baseBtn}`;

  return (
    <motion.nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-2 bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg' : 'py-4 bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link 
          to="/" 
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-blue-200"
        >
          Andres Avelar
        </Link>
        
        <div className="flex space-x-4">
          <Link
            to="/"
            className={`${location.pathname === '/' ? activeClasses : inactiveClasses}`}
          >
            Resume
          </Link>
          
          <Link
            to="/personal"
            className={`${location.pathname === '/personal' ? activeClasses : inactiveClasses}`}
          >
            Personal
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
