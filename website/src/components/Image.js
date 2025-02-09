import React, { useState } from 'react';

export const Image = ({ src, alt, aspectRatio = '16/9' }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="responsive-image" style={{ aspectRatio }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`image-content ${isLoading ? 'loading' : 'loaded'}`}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="image-loading">
          <div className="loading-spinner" />
        </div>
      )}
    </div>
  );
}; 