import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, className }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { current: button } = buttonRef;
    if (button) {
      const { clientX, clientY } = e;
      const { left, top, width, height } = button.getBoundingClientRect();
      const center = { x: left + width / 2, y: top + height / 2 };
      
      const distance = { x: clientX - center.x, y: clientY - center.y };
      const magneticPull = 0.4; // Adjust this value to change the magnetic effect strength

      setPosition({
        x: distance.x * magneticPull,
        y: distance.y * magneticPull,
      });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={`relative inline-flex items-center justify-center 
                 bg-gradient-to-r from-blue-500 to-purple-500 
                 text-white font-medium py-2 px-4 rounded-lg 
                 hover:from-blue-600 hover:to-purple-600 
                 transform transition-all duration-200 ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default MagneticButton;