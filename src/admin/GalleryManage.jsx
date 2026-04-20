import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function GalleryManage() {
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('General');
  const [file, setFile] = useState(null);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if(Array.isArray(data)) setImages(data);
    } catch(e) {}
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!file) return alert('Select an image');
    
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('category', category);
    formData.append('image', file);

    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
      body: formData
    });
    if(res.ok) {
      setCaption('');
      setCategory('General');
      setFile(null);
      document.getElementById('imgUpload').value = null;
      fetchGallery();
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this image?')) return;
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if(res.ok) fetchGallery();
  };

  return (
    <div className="manage-container">
      <h2 className="admin-page-title">Manage Gallery</h2>
      
      <div className="glass-card mb-2">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <input placeholder="Caption (Optional)" value={caption} onChange={e => setCaption(e.target.value)} />
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="General">General</option>
              <option value="Performance">Performance</option>
              <option value="Studio">Studio</option>
              <option value="Mountain">Mountain Life</option>
            </select>
          </div>
          <input type="file" id="imgUpload" accept="image/png, image/jpeg, image/webp" onChange={e => setFile(e.target.files[0])} />
          <button type="submit" className="btn-primary">Upload Photo</button>
        </form>
      </div>

      <div className="glass-card table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thumb</th>
              <th>Caption</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {images.length === 0 && <tr><td colSpan="4">No photos found.</td></tr>}
            {images.map(img => (
              <tr key={img.id}>
                <td><img src={img.image_url} alt="" style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 4}}/></td>
                <td>{img.caption || '-'}</td>
                <td>{img.category}</td>
                <td><button onClick={() => handleDelete(img.id)} className="btn-icon danger"><Trash2 size={16}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
