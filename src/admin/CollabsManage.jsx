import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function CollabsManage() {
  const [collabs, setCollabs] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', bio: '', youtube_url: '', instagram_url: '' });
  const [file, setFile] = useState(null);

  const fetchCollabs = async () => {
    try {
      const res = await fetch('/api/collaborators');
      const data = await res.json();
      if(Array.isArray(data)) setCollabs(data);
    } catch(e) {}
  };

  useEffect(() => { fetchCollabs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('role', form.role);
    formData.append('bio', form.bio);
    formData.append('youtube_url', form.youtube_url);
    formData.append('instagram_url', form.instagram_url);
    if(file) formData.append('image', file);

    const res = await fetch('/api/collaborators', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
      body: formData
    });
    if(res.ok) {
      setForm({ name: '', role: '', bio: '', youtube_url: '', instagram_url: '' });
      setFile(null);
      document.getElementById('collabImg').value = null;
      fetchCollabs();
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this collaborator?')) return;
    const res = await fetch(`/api/collaborators/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if(res.ok) fetchCollabs();
  };

  return (
    <div className="manage-container">
      <h2 className="admin-page-title">Manage Collaborators</h2>
      
      <div className="glass-card mb-2">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <input placeholder="Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input placeholder="Role (e.g. Flutist)" required value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
          </div>
          <div className="form-group">
            <input placeholder="YouTube URL (Optional)" value={form.youtube_url} onChange={e => setForm({...form, youtube_url: e.target.value})} />
            <input placeholder="Instagram URL (Optional)" value={form.instagram_url} onChange={e => setForm({...form, instagram_url: e.target.value})} />
          </div>
          <textarea placeholder="Short Bio" rows="2" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
          
          <div className="form-group" style={{alignItems:'center'}}>
             <span style={{color:'rgba(255,255,255,0.7)', fontSize:'0.9rem'}}>Photo (Optional):</span>
             <input type="file" id="collabImg" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          </div>

          <button type="submit" className="btn-primary">Add Collaborator</button>
        </form>
      </div>

      <div className="glass-card table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Face</th>
              <th>Name</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {collabs.length === 0 && <tr><td colSpan="4">No collaborators found.</td></tr>}
            {collabs.map(c => (
              <tr key={c.id}>
                <td>
                  {c.image_url ? <img src={c.image_url} alt="" style={{width:40, height:40, borderRadius:'50%', objectFit:'cover'}}/> : <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.1)'}}/>}
                </td>
                <td>{c.name}</td>
                <td>{c.role}</td>
                <td><button onClick={() => handleDelete(c.id)} className="btn-icon danger"><Trash2 size={16}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
