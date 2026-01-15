import React, { useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';

const AmbientVoidBackground = () => {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const handleMouseMove = (event) => {
      const xProgress = event.clientX / window.innerWidth - 0.5;
      const yProgress = event.clientY / window.innerHeight - 0.5;
      mouseX.set(xProgress);
      mouseY.set(yProgress);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  const orb1X = useTransform(smoothX, [-0.5, 0.5], [70, -70]);
  const orb1Y = useTransform(smoothY, [-0.5, 0.5], [70, -70]);
  const orb2X = useTransform(smoothX, [-0.5, 0.5], [-90, 90]);
  const orb2Y = useTransform(smoothY, [-0.5, 0.5], [-90, 90]);

  const orb1Animate = prefersReducedMotion
    ? { opacity: 0.28 }
    : { scale: [1, 1.12, 1], opacity: [0.24, 0.36, 0.24] };
  const orb2Animate = prefersReducedMotion
    ? { opacity: 0.26 }
    : { scale: [1, 1.26, 1], opacity: [0.2, 0.38, 0.2] };

  const grainAnimate = prefersReducedMotion
    ? { opacity: 0.05, filter: 'brightness(100%)' }
    : { opacity: [0.045, 0.07, 0.045], filter: ['brightness(100%)', 'brightness(115%)', 'brightness(100%)'] };

  return (
    <div
      className="fixed inset-0 z-0 bg-[#040a16] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0">
        <motion.div
          style={{ x: orb1X, y: orb1Y }}
          animate={orb1Animate}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 10, repeat: Infinity, ease: 'easeInOut' }
          }
          className="absolute -top-[30%] -left-[15%] h-[92vw] w-[92vw] rounded-full bg-blue-500/95 blur-[135px] mix-blend-screen"
        />
        <motion.div
          style={{ x: orb2X, y: orb2Y }}
          animate={orb2Animate}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }
          }
          className="absolute -bottom-[25%] -right-[10%] h-[86vw] w-[86vw] rounded-full bg-yellow-300/95 blur-[115px] mix-blend-screen"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 78% 78%, rgba(250,204,21,0.18) 0%, rgba(250,204,21,0.06) 30%, rgba(4,10,22,0) 60%)',
        }}
      />

      <motion.div
        className="absolute inset-0 mix-blend-soft-light"
        animate={grainAnimate}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 18, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="ambient-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#ambient-grain)" />
        </svg>
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(4,10,22,0) 0%, rgba(4,10,22,0.6) 55%, #040a16 100%)',
        }}
      />
    </div>
  );
};

export default AmbientVoidBackground;
