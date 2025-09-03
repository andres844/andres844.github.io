import React, { useEffect, useRef } from 'react';

// Canvas-based, responsive ASCII waves that propagate diagonally
// from top-left to bottom-right. Subtle by default.
const AsciiWavesBackground = ({
  opacity = 0.1, // stroke intensity
  speed = 0.16,   // cycles per second
  period = 16,    // diagonal wavelength in cells
  zIndex = 1,     // layering relative to content
}) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  const resize = (canvas) => {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    resize(canvas);

    const ctx = canvas.getContext('2d');
    // Responsive cell size (smaller on phones)
    const base = Math.min(window.innerWidth, window.innerHeight);
    const cell = Math.max(12, Math.min(20, Math.round(base / 48)));
    const charW = Math.round(cell * 0.66);
    const charH = cell;
    const cols = Math.ceil(window.innerWidth / charW) + 2;
    const rows = Math.ceil(window.innerHeight / charH) + 2;
    const twopi = Math.PI * 2;
    const k = twopi / period; // diagonal wave number per cell

    ctx.font = `${cell}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(255,255,255,${opacity})`;

    const step = (ts) => {
      // draw at ~30fps to keep it light
      if (!lastRef.current) lastRef.current = ts;
      const dt = (ts - lastRef.current) / 1000;
      if (dt < 1 / 30) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      lastRef.current = ts;

      const t = ts / 1000; // seconds
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Diagonal traveling wave: phase depends on (c + r)
      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const phase = (c + r) * k - twopi * speed * t;
          const dx = Math.sin(phase) * Math.min(10, charW * 0.6);
          const x = c * charW + dx;
          const y = r * charH + charH / 2;
          ctx.fillText("  | ", x, y);
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    const onResize = () => {
      resize(canvas);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [opacity, speed, period]);

  return (
    <canvas
      ref={canvasRef}
      className="ascii-waves"
      style={{ zIndex }}
      aria-hidden="true"
    />
  );
};

export default AsciiWavesBackground;
