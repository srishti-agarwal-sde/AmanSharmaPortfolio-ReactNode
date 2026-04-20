import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer fade-in">
      <div className="footer-content">
        <h3 className="footer-logo">Aman Sharma</h3>
        <p className="footer-tagline script-text">Music from the Soul</p>
        <div className="social-links">
          <a href="#youtube">YouTube</a>
          <a href="#instagram">Instagram</a>
          <a href="#spotify">Spotify</a>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Aman Sharma. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
