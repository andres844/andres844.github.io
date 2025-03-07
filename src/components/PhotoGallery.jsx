// FILE: src/components/PhotoGallery.jsx
import React from 'react';

const PhotoGallery = ({ photos }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {photos.map((photo, index) => (
        <img
          key={index}
          src={photo}
          alt={`Gallery image ${index + 1}`}
          className="object-cover rounded shadow"
        />
      ))}
    </div>
  );
};

export default PhotoGallery;