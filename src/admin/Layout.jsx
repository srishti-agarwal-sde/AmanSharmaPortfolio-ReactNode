import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, NavLink } from 'react-router-dom';
import { Video, Music, Users, Image as ImageIcon, LogOut, Globe } from 'lucide-react';
import VideosManage from './VideosManage';

import GalleryManage from './GalleryManage';
import MusicManage from './MusicManage';
import CollabsManage from './CollabsManage';

import './Admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar glass-panel">
        <div className="sidebar-header">
          <h2>Admin Space</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard/videos" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <Video size={20} /> Videos
          </NavLink>
          <NavLink to="/admin/dashboard/music" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <Music size={20} /> Unreleased
          </NavLink>
          <NavLink to="/admin/dashboard/collabs" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <Users size={20} /> Collaborators
          </NavLink>
          <NavLink to="/admin/dashboard/gallery" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <ImageIcon size={20} /> Gallery
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="nav-item">
            <Globe size={20} /> View Website
          </a>
          <button onClick={handleLogout} className="nav-item logout-btn">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Routes>
          <Route path="videos" element={<VideosManage />} />
          <Route path="music" element={<MusicManage />} />
          <Route path="collabs" element={<CollabsManage />} />
          <Route path="gallery" element={<GalleryManage />} />
          <Route path="*" element={
            <div className="dashboard-welcome glass-card">
              <h3>Welcome back, Aman.</h3>
              <p>Select a category from the sidebar to manage your content.</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}
