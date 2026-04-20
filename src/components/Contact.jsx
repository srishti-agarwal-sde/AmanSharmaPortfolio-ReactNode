import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section className="contact-section fade-in" id="contact">
      <div className="contact-container">
        <h2 className="section-title fade-in">Connect</h2>
        <div className="contact-content fade-in">
          <p className="contact-intro">Let's create magic together. Reach out for bookings, collaborations, or just to say hello.</p>
          <form className="contact-form">
            <div className="form-group">
              <input type="text" placeholder="Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email" required />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Subject" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-btn" onClick={(e) => e.preventDefault()}>Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
