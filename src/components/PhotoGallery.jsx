// FILE: src/components/PhotoGallery.jsx
import React from 'react';
import SmartImage from './SmartImage';

const PhotoGallery = ({ photos }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {photos.map((photo, index) => (
        <SmartImage
          key={index}
          src={photo}
          alt={`Gallery image ${index + 1}`}
          className="object-cover w-full h-full rounded shadow"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
        />
      ))}
    </div>
  );
};

export default PhotoGallery;
