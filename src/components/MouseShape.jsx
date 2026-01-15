import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const MouseShape = () => {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const size = 36;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const smoothX = useSpring(x, { damping: 30, stiffness: 500, mass: 0.2 });
  const smoothY = useSpring(y, { damping: 30, stiffness: 500, mass: 0.2 });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(media.matches);
    update();
    if (media.addEventListener) {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  useEffect(() => {
    if (!enabled || prefersReducedMotion) return undefined;
    const handleMouseMove = (event) => {
      x.set(event.clientX - size / 2);
      y.set(event.clientY - size / 2);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled, prefersReducedMotion, size, x, y]);

  if (!enabled || prefersReducedMotion) return null;

  return (
    <motion.div
      style={{ x: smoothX, y: smoothY }}
      className="fixed left-0 top-0 z-[120] pointer-events-none mix-blend-screen"
      aria-hidden="true"
    >
      <div className="relative h-9 w-9">
        <div className="absolute inset-0 rounded-full border border-blue-400/50 shadow-[0_0_24px_rgba(59,130,246,0.35)]" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-blue-300/30" />
        <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-blue-300/30" />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300/80 shadow-[0_0_12px_rgba(250,204,21,0.7)]" />
      </div>
    </motion.div>
  );
};

export default MouseShape;
