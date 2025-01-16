import React from 'react';
import { motion } from 'framer-motion';

const ClickableLogo = ({ href, imageSrc, altText }) => {
  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-2 relative">
      {/* Simple animated text without glow */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
        className="text-blue-400 text-sm font-medium"
      >
        Click me!
      </motion.span>
      
      {/* Logo with floating animation and shadow */}
      <motion.a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer relative"
        whileHover={{ scale: 1.1 }}
        animate={{ 
          y: [-5, 5, -5],
          rotate: [-2, 2, -2]
        }}
        transition={{ 
          y: { duration: 2, repeat: Infinity },
          rotate: { duration: 3, repeat: Infinity }
        }}
      >
        {/* Shadow element */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 
                      w-4/5 h-4 bg-black opacity-200 blur-md rounded-full"></div>
        
        {/* Logo image */}
        <img 
          src={imageSrc}
          alt={altText}
          className="w-24 h-24 rounded-full shadow-lg 
                   relative z-40 bg-gray-800"
        />
      </motion.a>
    </div>
  );
};

export default ClickableLogo;