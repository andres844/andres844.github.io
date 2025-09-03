// FILE: src/components/PhotoGallery.jsx
import React from 'react';

const PhotoGallery = ({ photos }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {photos.map((photo, index) => {
        const toAlt = (src) => {
          try {
            const q = src.indexOf('?');
            const clean = q === -1 ? src : src.slice(0, q);
            if (!/\.(png|jpe?g)$/i.test(clean)) return { avif: null, webp: null };
            const base = clean.replace(/\.(png|jpe?g)$/i, '');
            const query = q === -1 ? '' : src.slice(q);
            return { avif: `${base}.avif${query}`, webp: `${base}.webp${query}` };
          } catch { return { avif: null, webp: null }; }
        };
        const { avif, webp } = toAlt(photo);
        return (
          <picture key={index} className="block rounded shadow overflow-hidden">
            {avif && <source srcSet={avif} type="image/avif" />}
            {webp && <source srcSet={webp} type="image/webp" />}
            <img
              src={photo}
              alt={`Gallery image ${index + 1}`}
              className="object-cover w-full h-full"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
            />
          </picture>
        );
      })}
    </div>
  );
};

export default PhotoGallery;
