import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import db from './db.js';
import { requireAuth } from './middlewares/authMiddleware.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Expose image uploads publicly
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Do not Expose audio uploads publicly
app.get('/api/audio/:filename', (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Accept-Ranges', 'none');

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.trim().replace(/\s+/g, '-'));
  }
});
const upload = multer({ storage });

// --- AUTH ROUTE ---
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  if (password === process.env.ADMIN_PASSWORD) {
    // Simple Base64 token encoding instead of JWT
    const token = Buffer.from(`admin:${password}`).toString('base64');
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ error: 'Invalid password' });
  }
});

// --- YOUTUBE VIDEOS ---
app.get('/api/videos', (req, res) => {
  db.all('SELECT * FROM youtube_videos ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/videos', requireAuth, (req, res) => {
  const { title, category, video_url, description } = req.body;
  db.run(`INSERT INTO youtube_videos (title, category, video_url, description) VALUES (?,?,?,?)`,
    [title, category, video_url, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, category, video_url, description });
    }
  );
});

app.delete('/api/videos/:id', requireAuth, (req, res) => {
  db.run(`DELETE FROM youtube_videos WHERE id = ?`, req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- UNRELEASED MUSIC ---
app.get('/api/unreleased', (req, res) => {
  const typeFilter = req.query.type;
  let sql = 'SELECT * FROM unreleased_music ORDER BY created_at DESC';
  let params = [];
  if (typeFilter) {
    sql = 'SELECT * FROM unreleased_music WHERE type = ? ORDER BY created_at DESC';
    params.push(typeFilter);
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/unreleased', requireAuth, upload.single('file'), (req, res) => {
  const { title, description, type, external_link } = req.body;
  const file_url = req.file ? `/api/audio/${req.file.filename}` : external_link;
  db.run(`INSERT INTO unreleased_music (title, description, type, file_url) VALUES (?,?,?,?)`,
    [title, description, type, file_url],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, type, file_url });
    }
  );
});

app.delete('/api/unreleased/:id', requireAuth, (req, res) => {
  db.get(`SELECT file_url FROM unreleased_music WHERE id = ?`, [req.params.id], (err, row) => {
    if (row && row.file_url && row.file_url.startsWith('/uploads/')) {
      const p = path.join(__dirname, '..', row.file_url);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    db.run(`DELETE FROM unreleased_music WHERE id = ?`, req.params.id, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
});

// --- COLLABORATORS ---
app.get('/api/collaborators', (req, res) => {
  db.all('SELECT * FROM collaborators', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/collaborators', requireAuth, upload.single('image'), (req, res) => {
  const { name, role, bio, youtube_url, instagram_url } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  db.run(`INSERT INTO collaborators (name, role, bio, youtube_url, instagram_url, image_url) VALUES (?,?,?,?,?,?)`,
    [name, role, bio, youtube_url, instagram_url, image_url],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, role });
    }
  );
});

app.delete('/api/collaborators/:id', requireAuth, (req, res) => {
  db.get(`SELECT image_url FROM collaborators WHERE id = ?`, [req.params.id], (err, row) => {
    if (row && row.image_url && row.image_url.startsWith('/uploads/')) {
      const p = path.join(__dirname, '..', row.image_url);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    db.run(`DELETE FROM collaborators WHERE id = ?`, req.params.id, function () {
      res.json({ success: true });
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});