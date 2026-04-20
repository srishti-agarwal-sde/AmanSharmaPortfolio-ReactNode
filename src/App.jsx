import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import About from './components/About';
import Music from './components/Music';
import UnreleasedMusic from './components/UnreleasedMusic';
import Studio from './components/Studio';
import Collaborators from './components/Collaborators';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Admin Pages
import AdminLogin from './admin/Login';
import AdminLayout from './admin/Layout';

function PublicLayout() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in').forEach((el) => {
      if(el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Hero />
      <About />
      <Music />
      <UnreleasedMusic />
      <Studio />
      <Collaborators />
      <Gallery />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard/*" element={<AdminLayout />} />
    </Routes>
  );
}

export default App;
