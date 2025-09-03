import React, { useRef, useEffect, useState } from 'react';

// Seamless, JS-driven loop (no snap), with hover/offscreen pause
const PhotoCarousel = ({ photos, speed = 20, itemHeightClass = 'h-60 md:h-72 lg:h-80', itemWidthClass }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const reqRef = useRef(0);
  const xRef = useRef(0);
  const widthRef = useRef(0);
  const lastTsRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Duplicate photos to ensure seamless looping
  const extendedPhotos = [...photos, ...photos];

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mql.matches);
    update();
    if (mql.addEventListener) mql.addEventListener('change', update);
    else mql.addListener(update);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', update);
      else mql.removeListener(update);
    };
  }, []);

  // Pause when offscreen
  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === containerRef.current) {
            setPaused(!entry.isIntersecting);
          }
        });
      },
      { rootMargin: '0px', threshold: 0.1 }
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  // Measure single set width (half of duplicated track)
  const measure = () => {
    if (!trackRef.current) return 0;
    const w = trackRef.current.scrollWidth / 2;
    widthRef.current = w;
    return w;
  };

  // Animation loop using rAF; wraps without visual jump
  useEffect(() => {
    if (!trackRef.current) return;

    const preload = () =>
      Promise.race([
        Promise.all(
          photos.map(
            (src) =>
              new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                if (img.decode) img.decode().then(resolve).catch(resolve);
                else {
                  img.onload = resolve;
                  img.onerror = resolve;
                }
              })
          )
        ),
        new Promise((r) => setTimeout(r, 800)),
      ]);

    let running = true;

    const start = async () => {
      await preload();
      if (!measure()) {
        // Try next frame if not measurable yet
        requestAnimationFrame(start);
        return;
      }
      lastTsRef.current = 0;
      const step = (ts) => {
        if (!running) return;
        if (reduceMotion) {
          reqRef.current = requestAnimationFrame(step);
          return;
        }
        if (paused) {
          // keep lastTs in sync to avoid jump on resume
          lastTsRef.current = ts;
          reqRef.current = requestAnimationFrame(step);
          return;
        }
        if (!lastTsRef.current) lastTsRef.current = ts;
        const dt = (ts - lastTsRef.current) / 1000;
        lastTsRef.current = ts;

        const distPerSec = widthRef.current / speed; // pixels per second
        let x = xRef.current - distPerSec * dt;
        // Wrap seamlessly
        if (x <= -widthRef.current) x += widthRef.current;
        xRef.current = x;
        if (trackRef.current) trackRef.current.style.transform = `translate3d(${x}px,0,0)`;
        reqRef.current = requestAnimationFrame(step);
      };
      reqRef.current = requestAnimationFrame(step);
    };

    start();
    return () => {
      running = false;
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [photos, speed, reduceMotion, paused]);

  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);

  // Edge fades via CSS mask (with WebKit prefix)
  const maskStyle = {
    WebkitMaskImage:
      'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0))',
    maskImage:
      'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0))',
  };

  return (
    <div
      ref={containerRef}
      className="overflow-hidden relative"
      style={maskStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={trackRef} className="flex gap-2 will-change-transform">
        {extendedPhotos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Slide ${index % photos.length + 1}`}
            className={`${itemWidthClass ? itemWidthClass : 'w-auto'} ${itemHeightClass} object-cover rounded-md shadow-md flex-shrink-0 min-w-0`}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;
