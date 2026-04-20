import React, { useState, useEffect, useRef } from 'react';
import './Music.css';
import './UnreleasedMusic.css';

const UnreleasedMusic = () => {
  const [tracks, setTracks] = useState([]);
  const [tab, setTab] = useState('with_lyrics');
  const [currentSlide, setCurrentSlide] = useState(0);

  const startX = useRef(0);
  const endX = useRef(0);

  const itemsPerSlide = 4;

  useEffect(() => {
    fetch(`/api/unreleased?type=${tab}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTracks(data);
          setCurrentSlide(0); // reset on tab change
        }
      })
      .catch(e => console.error(e));
  }, [tab]);

  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener('contextmenu', disableRightClick);

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
    };
  }, []);

  const totalSlides = Math.ceil(tracks.length / itemsPerSlide);

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // Swipe handlers (mobile)
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    endX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = startX.current - endX.current;

    if (diff > 50) {
      nextSlide(); // swipe left
    } else if (diff < -50) {
      prevSlide(); // swipe right
    }
  };

  return (
    <section className="music-section unreleased-section fade-in">
      
      <span className="music-subheading fade-in">
        Unreleased Work
      </span>

      <h2 className="section-title fade-in music-heading">
        Sounds still <em>finding their way</em>
      </h2>

      <div className="music-divider fade-in">
        <span> ♪ </span>
      </div>

      {/* Tabs */}
      <div className="unreleased-tab-container fade-in">
        <button
          onClick={() => setTab('with_lyrics')}
          className={`unreleased-tab-btn ${tab === 'with_lyrics' ? 'active' : ''}`}
        >
          With Lyrics
        </button>

        <button
          onClick={() => setTab('instrumental')}
          className={`unreleased-tab-btn ${tab === 'instrumental' ? 'active' : ''}`}
        >
          Instrumental
        </button>
      </div>

      {/* Empty State */}
      {tracks.length === 0 && (
        <p className="unreleased-empty-msg">
          No tracks in this category yet.
        </p>
      )}

      {/* Carousel */}
      {tracks.length > 0 && (
        <div
          className="carousel-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >

          {/* Left Button */}
          <button
            className={`carousel-btn left ${currentSlide === 0 ? 'disabled' : ''}`}
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            ‹
          </button>

          {/* Viewport */}
          <div className="carousel-viewport">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                const slideItems = tracks.slice(
                  slideIndex * itemsPerSlide,
                  slideIndex * itemsPerSlide + itemsPerSlide
                );

                // Fill empty slots to always make 4 items
                while (slideItems.length < itemsPerSlide) {
                  slideItems.push(null);
                }

                return (
                  <div key={slideIndex} className="carousel-slide">
                    {slideItems.map((t, index) => (
                      t ? (
                        <div key={t.id} className="music-card unreleased-track-card">
                          <div className="unreleased-track-info">
                            <h3 className="unreleased-track-title">{t.title}</h3>

                            {t.description && (
                              <p className="unreleased-track-desc">{t.description}</p>
                            )}

                            <span className="music-tag unreleased-track-tag">
                              {t.type === 'with_lyrics' ? 'Lyrical' : 'Instrumental'}
                            </span>
                          </div>

                          <audio
                            controls
                            controlsList="nodownload noplaybackrate"
                            disablePictureInPicture
                            src={t.file_url}
                            className="unreleased-audio"
                          />
                        </div>
                      ) : (
                        <div key={`empty-${index}`} className="music-card unreleased-track-card empty-card"></div>
                      )
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Button */}
          <button
            className={`carousel-btn right ${currentSlide === totalSlides - 1 ? 'disabled' : ''}`}
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
          >
            ›
          </button>

          {/* Dots Indicator */}
          <div className="carousel-dots">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <span
                key={i}
                className={`dot ${i === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
              ></span>
            ))}
          </div>

        </div>
      )}
    </section>
  );
};

export default UnreleasedMusic;