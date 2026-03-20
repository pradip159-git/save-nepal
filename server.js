const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = 'Rp369#og33';

// Ensure data directories exist
const DATA_DIR = path.join(__dirname, 'data');
const COMPLAINTS_DIR = path.join(DATA_DIR, 'complaints');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(COMPLAINTS_DIR)) fs.mkdirSync(COMPLAINTS_DIR, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Multer storage config - save files per complaint
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpDir = path.join(__dirname, 'data', 'tmp_uploads');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    const safeName = Date.now() + '_' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, safeName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|mp3|wav|ogg|m4a|mp4|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error('File type not allowed: ' + ext));
  }
});

// POST /api/complaints - Submit a new complaint
app.post('/api/complaints', upload.array('attachments', 10), (req, res) => {
  try {
    const id = uuidv4();
    const shortId = 'NCP-' + id.slice(0, 8).toUpperCase();
    const complaintDir = path.join(COMPLAINTS_DIR, shortId);
    fs.mkdirSync(complaintDir, { recursive: true });

    // Move uploaded files
    const files = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(f => {
        const dest = path.join(complaintDir, f.filename);
        fs.renameSync(f.path, dest);
        files.push({ name: f.originalname, saved: f.filename, mimetype: f.mimetype });
      });
    }

    // Parse multi-select categories
    const categoriesRaw = req.body.categories || '';
    const categoriesArr = categoriesRaw ? categoriesRaw.split(',').map(c => c.trim()).filter(Boolean) : ['Other'];

    const complaint = {
      id: shortId,
      fullId: id,
      timestamp: new Date().toISOString(),
      status: 'Pending',
      location: {
        province: req.body.province || '',
        district: req.body.district || '',
        municipality: req.body.municipality || '',
        ward: req.body.ward || '',
        tole: req.body.tole || '',
        exactLocation: req.body.exactLocation || ''
      },
      reporter: {
        name: req.body.anonymous === 'Yes' ? 'Anonymous' : (req.body.name || 'Anonymous'),
        phone: req.body.phone || '',
        email: req.body.email || '',
        occupation: req.body.occupation || '',
        anonymous: req.body.anonymous || 'No'
      },
      categories: categoriesArr,
      category: categoriesArr[0] || 'Other',
      urgency: req.body.urgency || 'Normal',
      title: req.body.title || '',
      personsInvolved: req.body.personsInvolved || '',
      incidentDate: req.body.incidentDate || '',
      description: req.body.description || '',
      attachments: files
    };

    // Save complaint JSON
    fs.writeFileSync(path.join(complaintDir, 'complaint.json'), JSON.stringify(complaint, null, 2));
    res.json({ success: true, id: shortId });
  } catch (err) {
    console.error('Error saving complaint:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/complaints - Get all complaints (admin only)
app.get('/api/complaints', (req, res) => {
  const pwd = req.headers['x-admin-password'];
  if (pwd !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

  const complaints = [];
  if (!fs.existsSync(COMPLAINTS_DIR)) return res.json([]);

  const dirs = fs.readdirSync(COMPLAINTS_DIR);
  dirs.forEach(dir => {
    const f = path.join(COMPLAINTS_DIR, dir, 'complaint.json');
    if (fs.existsSync(f)) {
      try { complaints.push(JSON.parse(fs.readFileSync(f, 'utf8'))); } catch (e) {}
    }
  });
  complaints.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(complaints);
});

// PATCH /api/complaints/:id/status - Update status
app.patch('/api/complaints/:id/status', (req, res) => {
  const pwd = req.headers['x-admin-password'];
  if (pwd !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const complaintFile = path.join(COMPLAINTS_DIR, id, 'complaint.json');
  if (!fs.existsSync(complaintFile)) return res.status(404).json({ error: 'Not found' });

  const complaint = JSON.parse(fs.readFileSync(complaintFile, 'utf8'));
  complaint.status = status;
  complaint.lastUpdated = new Date().toISOString();
  fs.writeFileSync(complaintFile, JSON.stringify(complaint, null, 2));
  res.json({ success: true });
});

// GET /api/attachments/:id/:filename - Download attachment
app.get('/api/attachments/:id/:filename', (req, res) => {
  const pwd = req.headers['x-admin-password'];
  if (pwd !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  const filePath = path.join(COMPLAINTS_DIR, req.params.id, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send('Not found');
  res.download(filePath);
});

// GET /api/check-status/:id - Citizen checks their complaint status
app.get('/api/check-status/:id', (req, res) => {
  const complaintFile = path.join(COMPLAINTS_DIR, req.params.id, 'complaint.json');
  if (!fs.existsSync(complaintFile)) return res.status(404).json({ error: 'Complaint not found' });
  const c = JSON.parse(fs.readFileSync(complaintFile, 'utf8'));
  res.json({ id: c.id, title: c.title, category: c.category, status: c.status, timestamp: c.timestamp, location: c.location });
});

app.listen(PORT, () => {
  console.log('====================================');
  console.log('  Save Nepal From Corruption Server');
  console.log('  Running at http://localhost:' + PORT);
  console.log('  Data stored in: ' + DATA_DIR);
  console.log('====================================');
});
