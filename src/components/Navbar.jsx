import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

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
  const activeClasses = 'opacity-100 scale-95 shadow-inner';
  const inactiveClasses = 'opacity-100'; // removed opacity and hover changes

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
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-yellow-300"
        >
          Andres Avelar
        </Link>
        
        <div className="flex space-x-4">
          <MagneticButton
            className={`
              ${location.pathname === '/'
                ? activeClasses
                : inactiveClasses
              }
              active:scale-95 active:shadow-inner
            `}
          >
            <Link to="/" className="block w-full text-center text-white">
              Resume
            </Link>
          </MagneticButton>
          
          <MagneticButton
            className={`
              ${location.pathname === '/personal'
                ? activeClasses
                : inactiveClasses
              }
              active:scale-95 active:shadow-inner
            `}
          >
            <Link to="/personal" className="block w-full text-center text-white">
              Personal
            </Link>
          </MagneticButton>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;