import React from 'react';
import './About.css';

const About = () => {
  return (
    <section className="about-section fade-in" id="about">
      <div className="about-container">
        <div className="about-content">
          <div className="about-text fade-in">
            <span className="about-subheading fade-in">The Artist</span>
            <h2 className="fade-in about-heading">Born from the <em>mountains</em></h2>
            <div className="ornamental-divider fade-in">
              <span>❧</span>
            </div>
            <p>
              Born amidst the snow-capped peaks of Himachal Pradesh, my music is an
              echo of the mountains. Every lyric, every strum carries the scent of
              pine trees and the chill of the morning breeze.
            </p>
            <p>
              From learning traditional folk tunes on an old Rabab to composing original songs
              in my mountain cabin, my aim is to bridge the ancient soul of Himachali culture
              with the modern world.
            </p>

            <blockquote className="about-quote fade-in">
              <p>
                “Music is the mountain's language.<br />
                I am only its translator.”
              </p>
            </blockquote>

            <div className="signature script-text">With love, Aman</div>
          </div>
          <div className="about-image-wrapper fade-in">
            <img src="/candid_performance.png" alt="Aman playing guitar" className="about-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
