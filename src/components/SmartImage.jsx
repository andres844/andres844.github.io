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
 * SmartImage can optionally try a WEBP variant if `preferWebp` is true.
 * It checks with a lightweight HEAD request and falls back to `src`.
 * Decisions are cached per original `src`.
 */
const SmartImage = ({
  src,
  alt = '',
  className = '',
  loading,
  decoding,
  fetchpriority,
  draggable,
  width,
  height,
  style,
  onLoad,
  onError,
  preferWebp = false,
}) => {
  const [finalSrc, setFinalSrc] = useState(() => resolvedCache.get(src) || src);

  const webp = useMemo(() => (preferWebp ? deriveWebp(src) : null), [src, preferWebp]);

  useEffect(() => {
    let aborted = false;
    const cached = preferWebp ? resolvedCache.get(src) : null;
    if (cached) {
      setFinalSrc(cached);
      return;
    }
    // If not opting into webp or no candidate, stick to original
    if (!preferWebp || !webp) {
      setFinalSrc(src);
      if (preferWebp) resolvedCache.set(src, src);
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
  }, [src, webp, preferWebp]);

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
