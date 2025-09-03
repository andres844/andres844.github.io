import React, { useEffect, useMemo, useState } from 'react';

// Cache resolved sources across instances by original src
const resolvedCache = new Map();

// Derive a potential WEBP path from a PNG/JPG path
const deriveWebp = (src) => {
  try {
    const q = src.indexOf('?');
    const clean = q === -1 ? src : src.slice(0, q);
    if (!/\.(png|jpe?g)$/i.test(clean)) return null;
    const base = clean.replace(/\.(png|jpe?g)$/i, '');
    const query = q === -1 ? '' : src.slice(q);
    return `${base}.webp${query}`;
  } catch {
    return null;
  }
};

/**
 * SmartImage tries to use a WEBP variant if it exists in `public/`.
 * It checks with a lightweight HEAD request and falls back to the
 * original `src` if the variant is missing. Decisions are cached.
 */
const SmartImage = ({ src, alt = '', className = '', loading, decoding, fetchpriority, draggable, width, height, style, onLoad, onError }) => {
  const [finalSrc, setFinalSrc] = useState(() => resolvedCache.get(src) || src);

  const webp = useMemo(() => deriveWebp(src), [src]);

  useEffect(() => {
    let aborted = false;
    const cached = resolvedCache.get(src);
    if (cached) {
      setFinalSrc(cached);
      return;
    }
    // If no webp candidate, stick to original
    if (!webp) {
      resolvedCache.set(src, src);
      setFinalSrc(src);
      return;
    }
    // Check if the WEBP exists without downloading the whole file
    const run = async () => {
      try {
        const resp = await fetch(webp, { method: 'HEAD', cache: 'force-cache' });
        if (!aborted && resp && (resp.ok || resp.status === 304)) {
          resolvedCache.set(src, webp);
          setFinalSrc(webp);
        } else {
          resolvedCache.set(src, src);
          setFinalSrc(src);
        }
      } catch (_) {
        // Network errors -> use original
        if (!aborted) {
          resolvedCache.set(src, src);
          setFinalSrc(src);
        }
      }
    };
    // Defer work slightly to avoid blocking main rendering path
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 300 });
      return () => {
        aborted = true;
        window.cancelIdleCallback && window.cancelIdleCallback(id);
      };
    } else {
      const t = setTimeout(run, 50);
      return () => {
        aborted = true;
        clearTimeout(t);
      };
    }
  }, [src, webp]);

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      fetchpriority={fetchpriority}
      draggable={draggable}
      width={width}
      height={height}
      style={style}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default SmartImage;

