import React, { useState, useEffect } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then(data => {
      if(Array.isArray(data)) setImages(data);
    }).catch(e => console.error(e));
  }, []);

  return (
    <section className="gallery-section fade-in" id="gallery">
      <h2 className="section-title fade-in">Through The Lens</h2>
      <div className="gallery-grid">
        {images.map((img, idx) => (
          <div key={idx} className={`gallery-item fade-in`}>
            <img src={img.image_url} alt={img.caption || `Gallery ${idx}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
