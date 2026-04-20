import React from 'react';
import './Music.css';
import './Studio.css';

const Studio = () => {
  return (
    <section className="studio-section fade-in" id="studio">
      {/* <div className="studio-container"> */}
      <span className="music-subheading fade-in">Instruments & Studio</span>
      <h2 className="section-title fade-in music-heading">His hands, <em>many voices</em></h2>
      <div className="music-divider fade-in">
        <span> ♩ </span>
      </div>
      <div className="studio-content fade-in">
        <img src="/rustic_studio.png" alt="Rustic Studio" className="studio-image" />
        <div className="studio-text">
          <h3>Where Magic Happens</h3>
          <p>
            Nestled in Himachal Pradesh, Aman's personal recording studio is not just a technical space — it is a sanctuary. Surrounded by nature, it is where I blend acoustic mountain echoes with modern production, capturing the raw
            essence of Himachali folk traditions.
          </p>
          <p>
            Every track is recorded, mixed, and produced in-house, preserving the intimacy and authenticity that defines his sound. No intermediary — just the artist and his music.
          </p>
          <div className="studio-services">
            <div className="service-item">
              <span className="icon">🎙️</span>
              <span>Vocal & Instrument Recording</span>
            </div>
            <div className="service-item">
              <span className="icon">🎚️</span>
              <span>Mixing & Mastering</span>
            </div>
            <div className="service-item">
              <span className="icon">🎼</span>
              <span>Original Composition</span>
            </div>
            <div className="service-item">
              <span className="icon">🤝</span>
              <span>Remote Collaborations</span>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </section>
  );
};

export default Studio;
