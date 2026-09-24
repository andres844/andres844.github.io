import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export function RandomLetterSwap({
  label = '',
  className = '',
  staggerDuration = 0.025,
  transition = { duration: 0.5, type: 'spring', bounce: 0.15 },
  onClick,
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Generate a randomized order for the letters to animate
  const randomOrder = useMemo(() => {
    const indices = Array.from({ length: label.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [label]);

  return (
    <motion.span
      className={`relative inline-flex items-center select-none overflow-hidden cursor-pointer ${className}`.trim()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="inline-flex">
        {label.split('').map((char, index) => {
          if (char === ' ') {
            return <span key={index}>&nbsp;</span>;
          }

          const delay = randomOrder[index] * staggerDuration;
          const letterTransition = {
            ...transition,
            delay: isHovered
              ? delay
              : (label.length - 1 - randomOrder[index]) * (staggerDuration * 0.5),
          };

          return (
            <span
              key={index}
              className="relative inline-block overflow-hidden h-[1.3em] leading-[1.3em]"
            >
              <motion.span
                className="inline-block"
                initial={{ y: '0%' }}
                animate={{ y: isHovered ? '-100%' : '0%' }}
                transition={letterTransition}
              >
                {char}
              </motion.span>
              <motion.span
                className="absolute left-0 top-0 inline-block"
                initial={{ y: '100%' }}
                animate={{ y: isHovered ? '0%' : '100%' }}
                transition={letterTransition}
              >
                {char}
              </motion.span>
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}

export default RandomLetterSwap;
