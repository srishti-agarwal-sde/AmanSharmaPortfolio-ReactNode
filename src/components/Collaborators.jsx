import React, { useRef, useState, useEffect } from 'react';
import './Music.css';
import './Collaborators.css';

const Collaborators = () => {
  const scrollRef = useRef(null);
  const [collabs, setCollabs] = useState([]);

  useEffect(() => {
    fetch('/api/collaborators')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCollabs(data);
      })
      .catch(e => console.error(e));
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
  };

  return (
    <section className="collaborators-section fade-in">
      <div className="collaborators-container">
        
        <span className="music-subheading fade-in">
          Collaborations
        </span>

        <h2 className="section-title fade-in music-heading">
          Voices that <em>echo together</em>
        </h2>
        <div className="music-divider fade-in">
          <span>❧</span>
        </div>

        <div className="carousel-container fade-in">
          <button className="carousel-btn left" onClick={scrollLeft} aria-label="Scroll left">
            &#10094;
          </button>

          <div className="music-carousel collaborators-grid" ref={scrollRef}>
            {collabs.length === 0 && <p style={{color:'white', margin:'0 auto'}}>No collaborators yet.</p>}
            {collabs.map(c => (
              <div key={c.id} className="collab-card">

                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} className="collab-image" />
                ) : (
                  <div className="collab-placeholder"></div>
                )}

                <div className="collab-info">
                  <h3 className="collab-name">{c.name}</h3>
                  <span className="collab-role">{c.role}</span>
                </div>

                {c.bio && <p className="collab-bio">{c.bio}</p>}

                <div className="collab-links">
                  {c.youtube_url && (
                    <a href={c.youtube_url} target="_blank" rel="noopener noreferrer" className="youtube-link">
                      YouTube
                    </a>
                  )}
                  {c.instagram_url && (
                    <a href={c.instagram_url} target="_blank" rel="noopener noreferrer" className="instagram-link">
                      Instagram
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>

          <button className="carousel-btn right" onClick={scrollRight} aria-label="Scroll right">
            &#10095;
          </button>
        </div>
        
      </div>
    </section>
  );
};

export default Collaborators;