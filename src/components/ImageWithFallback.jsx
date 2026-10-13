import { useState } from 'react';

/** Image that degrades to a styled placeholder instead of a broken icon. */
export default function ImageWithFallback({ src, alt, label, className }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={`img-fallback ${className || ''}`} role="img" aria-label={alt || label || 'Image unavailable'}>
        <div>
          {(label || alt || '?').charAt(0)}
          <small>{label || 'Image unavailable'}</small>
        </div>
      </div>
    );
  }
  return <img src={src} alt={alt || ''} loading="lazy" className={className} onError={() => setFailed(true)} />;
}
