import React from 'react';
import { motion, useScroll } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-200 origin-left z-[9999] pointer-events-none shadow-[0_0_12px_rgba(245,158,11,0.6)]"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

export default ScrollProgress;
