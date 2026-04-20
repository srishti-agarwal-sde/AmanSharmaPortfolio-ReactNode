import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section fade-in">
      <div className="hero-content">
        <h1 className="hero-title">Aman Sharma</h1>
        <p className="hero-tagline script-text">Soulful Sounds from the Mountains</p>
      </div>
      <div className="scroll-indicator">
        <span>Discover</span>
        <div className="arrow"></div>
      </div>
    </section>
  );
};

export default Hero;
