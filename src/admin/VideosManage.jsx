import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function VideosManage() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState({ title: '', category: '', video_url: '', description: '' });

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      if(Array.isArray(data)) setVideos(data);
    } catch(e) { console.error('Error fetching videos', e); }
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/videos', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(form)
    });
    if(res.ok) {
      setForm({ title: '', category: '', video_url: '', description: '' });
      fetchVideos();
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this video?')) return;
    const res = await fetch(`/api/videos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if(res.ok) fetchVideos();
  };

  return (
    <div className="manage-container">
      <h2 className="admin-page-title">Manage YouTube Videos</h2>
      
      <div className="glass-card mb-2">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <input placeholder="Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <input placeholder="Category (e.g. Official Release)" required value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
          </div>
          <div className="form-group">
            <input placeholder="YouTube ID or URL" required value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} />
          </div>
          <textarea placeholder="Description (Optional)" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <button type="submit" className="btn-primary">Add Video</button>
        </form>
      </div>

      <div className="glass-card table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {videos.length === 0 && <tr><td colSpan="3">No videos found.</td></tr>}
            {videos.map(v => (
              <tr key={v.id}>
                <td>{v.title}</td>
                <td>{v.category}</td>
                <td>
                  <button onClick={() => handleDelete(v.id)} className="btn-icon danger" aria-label="Delete">
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
