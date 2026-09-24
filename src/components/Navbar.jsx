import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RandomLetterSwap } from '@/components/ui/random-letter-swap';

const navItems = [
  { name: 'Resume', path: '/' },
  { name: 'Personal', path: '/personal' },
  { name: 'Games', path: '/games' },
];

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

  return (
    <motion.nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2.5 bg-slate-950/20 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.2)]' 
          : 'py-4 bg-transparent border-b border-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link 
          to="/" 
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-300"
        >
          Andres Avelar
        </Link>
        
        <div className="flex items-center gap-6 sm:gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors duration-200 text-base sm:text-lg py-1 relative ${
                  isActive
                    ? 'text-amber-300 font-semibold'
                    : 'text-slate-300 hover:text-white font-medium'
                }`}
              >
                <RandomLetterSwap
                  label={item.name}
                  staggerDuration={0.025}
                  transition={{ duration: 0.5, type: 'spring', bounce: 0.15 }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
