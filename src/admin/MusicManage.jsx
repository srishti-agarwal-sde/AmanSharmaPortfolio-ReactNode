import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function MusicManage() {
  const [tracks, setTracks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', type: 'with_lyrics', external_link: '' });
  const [file, setFile] = useState(null);

  const fetchTracks = async () => {
    try {
      const res = await fetch('/api/unreleased');
      const data = await res.json();
      if(Array.isArray(data)) setTracks(data);
    } catch(e) {}
  };

  useEffect(() => { fetchTracks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('type', form.type);
    formData.append('external_link', form.external_link);
    if(file) formData.append('file', file);

    const res = await fetch('/api/unreleased', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
      body: formData
    });
    if(res.ok) {
      setForm({ title: '', description: '', type: 'with_lyrics', external_link: '' });
      setFile(null);
      document.getElementById('audioUpload').value = null;
      fetchTracks();
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this track?')) return;
    const res = await fetch(`/api/unreleased/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if(res.ok) fetchTracks();
  };

  return (
    <div className="manage-container">
      <h2 className="admin-page-title">Manage Unreleased Music</h2>
      
      <div className="glass-card mb-2">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <input placeholder="Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="with_lyrics">With Lyrics</option>
              <option value="instrumental">Instrumental (No Lyrics)</option>
            </select>
          </div>
          <textarea placeholder="Description" rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          
          <div className="form-group" style={{alignItems:'center'}}>
             <span style={{color:'rgba(255,255,255,0.7)', fontSize:'0.9rem'}}>Audio File:</span>
             <input type="file" id="audioUpload" accept="audio/*" onChange={e => setFile(e.target.files[0])} />
             <span style={{color:'rgba(255,255,255,0.7)', fontSize:'0.9rem'}}>OR External Link:</span>
             <input placeholder="SoundCloud/Spotify URL" value={form.external_link} onChange={e => setForm({...form, external_link: e.target.value})} />
          </div>

          <button type="submit" className="btn-primary">Add Track</button>
        </form>
      </div>

      <div className="glass-card table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Source</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tracks.length === 0 && <tr><td colSpan="4">No tracks found.</td></tr>}
            {tracks.map(t => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.type === 'instrumental' ? 'Instrumental' : 'With Lyrics'}</td>
                <td>{t.file_url ? (t.file_url.startsWith('/uploads') ? 'Uploaded File' : 'External Link') : '-'}</td>
                <td><button onClick={() => handleDelete(t.id)} className="btn-icon danger"><Trash2 size={16}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
