import React, { useRef, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

const PhotoCarousel = ({ photos, speed = 20 }) => {
  const controls = useAnimationControls();
  const carouselRef = useRef(null);
  // Triple the photos to ensure seamless looping
  const extendedPhotos = [...photos, ...photos, ...photos];
  
  useEffect(() => {
    if (!carouselRef.current) return;
    
    const animate = async () => {
      // Calculate total width of a single set of photos
      const singleSetWidth = carouselRef.current.scrollWidth / 3;
      
      await controls.start({
        x: -singleSetWidth,
        transition: {
          duration: speed,
          ease: "linear",
        }
      });

      // Reset position without animation
      controls.set({ x: 0 });
      
      // Recursively continue animation
      animate();
    };
    
    animate();
    
    return () => controls.stop();
  }, [controls, speed, photos.length]);

  return (
    <div className="overflow-hidden">
      <motion.div
        ref={carouselRef}
        className="flex"
        animate={controls}
        style={{ willChange: 'transform' }}
      >
        {extendedPhotos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Slide ${index % photos.length + 1}`}
            className="w-auto h-80 object-cover rounded-md shadow-md mr-2 flex-shrink-0 min-w-0"
            loading="lazy"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default PhotoCarousel;