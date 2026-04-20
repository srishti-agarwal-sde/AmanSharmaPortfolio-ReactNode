import React, { useRef, useState, useEffect } from 'react';
import './Music.css';

const Music = () => {
  const scrollRef = useRef(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch('/api/videos').then(r => r.json()).then(data => {
      if(Array.isArray(data)) setSongs(data);
    }).catch(e => console.error(e));
  }, []);

  const getYoutubeId = (url) => {
    if(!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
  };

  return (
    <section className="music-section fade-in" id="music">
      <span className="music-subheading fade-in">Latest Release</span>
      <h2 className="section-title fade-in music-heading">Music from the <em>mountains</em></h2>
      <div className="music-divider fade-in">
        <span> 𝄞 </span>
      </div>
      <div className="carousel-container fade-in">
        <button className="carousel-btn left" onClick={scrollLeft} aria-label="Scroll left">
          &#10094;
        </button>

        <div className="music-carousel" ref={scrollRef}>
          {songs.length === 0 && <p style={{color:'white', margin:'0 auto'}}>No videos uploaded yet.</p>}
          {songs.map((song, idx) => (
            <div key={idx} className="music-card">
              <div className="video-container">
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(song.video_url)}?controls=1&showinfo=0&rel=0`}
                  title={song.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen>
                </iframe>
              </div>
              <div className="music-info">
                <h3>{song.title}</h3>
                <span className="music-tag">{song.category}</span>
                {song.description && <p style={{fontSize:'0.9rem', color:'rgba(255,255,255,0.7)', marginTop:'8px'}}>{song.description}</p>}
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-btn right" onClick={scrollRight} aria-label="Scroll right">
          &#10095;
        </button>
      </div>
    </section>
  );
};

export default Music;
