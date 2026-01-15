import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const CursorRipples = () => {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [ripples, setRipples] = useState([]);
  const idRef = useRef(0);
  const lastMoveRef = useRef(0);

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

    const addRipple = (x, y, variant) => {
      const id = idRef.current + 1;
      idRef.current = id;
      setRipples((prev) => {
        const next = [...prev, { id, x, y, variant }];
        return next.length > 16 ? next.slice(-16) : next;
      });
    };

    const handlePointerDown = (event) => {
      addRipple(event.clientX, event.clientY, 'click');
    };

    const handlePointerMove = (event) => {
      const now = performance.now();
      if (now - lastMoveRef.current < 120) return;
      lastMoveRef.current = now;
      addRipple(event.clientX, event.clientY, 'move');
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [enabled, prefersReducedMotion]);

  if (!enabled || prefersReducedMotion) return null;

  return (
    <div className="cursor-ripples" aria-hidden="true">
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={`cursor-ripple cursor-ripple--${ripple.variant}`}
          style={{ left: ripple.x, top: ripple.y }}
          onAnimationEnd={() =>
            setRipples((prev) => prev.filter((item) => item.id !== ripple.id))
          }
        />
      ))}
    </div>
  );
};

export default CursorRipples;
