const express = require('express');
const multer = require('multer');
const cors = require('cors');
const compression = require('compression');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Load configuration
let CONFIG = {};
const configPath = path.join(__dirname, 'config.js');
if (fs.existsSync(configPath)) {
  try {
    CONFIG = require(configPath);
  } catch (e) {
    console.warn('Warning: Could not load config.js');
    CONFIG = { email: { enabled: false }, rateLimit: { maxComplaintsPerDay: 5 } };
  }
} else {
  CONFIG = { email: { enabled: false }, rateLimit: { maxComplaintsPerDay: 5 } };
}

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = 'Rp369#og33';
const ADMIN_EMAIL = CONFIG.email?.recipient || 'savenepal@gmail.com'; // Reads from config.js
const ADMIN_PHONE = '9766105452'; // Your phone number
const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_COMPLAINTS_PER_DAY = CONFIG.rateLimit?.maxComplaintsPerDay || 5; // Rate limit: N complaints per day per IP

// Ensure data directories exist
const DATA_DIR = path.join(__dirname, 'data');
const COMPLAINTS_DIR = path.join(DATA_DIR, 'complaints');
const LOGIN_ATTEMPTS_FILE = path.join(DATA_DIR, 'login-attempts.json');
const COMPLAINT_TRACKER_FILE = path.join(DATA_DIR, 'complaint-tracker.json');
const LOG_FILE = path.join(DATA_DIR, 'server-logs.txt');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(COMPLAINTS_DIR)) fs.mkdirSync(COMPLAINTS_DIR, { recursive: true });

// ===== LOGGING FUNCTION =====
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);
  try {
    fs.appendFileSync(LOG_FILE, logMessage + '\n');
  } catch (e) {}
}

// ===== ERROR HANDLING =====
process.on('uncaughtException', (err) => {
  log(`UNCAUGHT EXCEPTION: ${err.message}`, 'ERROR');
  log(err.stack, 'ERROR');
});

process.on('unhandledRejection', (reason, promise) => {
  log(`UNHANDLED REJECTION: ${reason}`, 'ERROR');
});

// ===== EMAIL NOTIFICATION SETUP =====
const emailTransporter = nodemailer.createTransport({
  service: CONFIG.email?.service || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || CONFIG.email?.user || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || CONFIG.email?.pass || 'your-app-password'
  }
});

const EMAIL_ENABLED = CONFIG.email?.enabled || false;

function sendNotificationEmail(complaintData) {
  if (!EMAIL_ENABLED) {
    log(`Email notifications disabled. To enable, edit config.js and set email.enabled = true`, 'INFO');
    return;
  }
  
  try {
    const complaintDetails = `
Complaint ID: ${complaintData.id}
Date: ${new Date(complaintData.timestamp).toLocaleString()}
Status: Pending
Category: ${complaintData.category || 'Other'}
Province: ${complaintData.location?.province || 'N/A'}
District: ${complaintData.location?.district || 'N/A'}
Title: ${complaintData.title || 'No title'}
Description: ${complaintData.description || 'No description'}
Reporter: ${complaintData.reporter?.name || 'Anonymous'}
Reporter Email: ${complaintData.reporter?.email || 'N/A'}
Reporter Phone: ${complaintData.reporter?.phone || 'N/A'}
    `;
    
    const mailOptions = {
      from: CONFIG.email?.user || 'your-email@gmail.com',
      to: ADMIN_EMAIL,
      subject: `🚨 New Complaint Filed: ${complaintData.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #BA0C2F;">
            <h2 style="color: #BA0C2F; margin-top: 0;">New Complaint Received ✓</h2>
            <p><strong>Complaint ID:</strong> <code style="background: #f0f0f0; padding: 4px 8px;">${complaintData.id}</code></p>
            <p><strong>Title:</strong> ${complaintData.title || 'No title'}</p>
            <p><strong>Category:</strong> ${complaintData.category || 'Other'}</p>
            <p><strong>Location:</strong> ${complaintData.location?.province || 'N/A'}, ${complaintData.location?.district || 'N/A'}</p>
            <p><strong>Description:</strong></p>
            <p style="background: #f9f9f9; padding: 10px; border-radius: 4px;">${(complaintData.description || 'No description').substring(0, 200)}...</p>
            <p><strong>Reporter:</strong> ${complaintData.reporter?.name || 'Anonymous'}</p>
            <p><strong>Date:</strong> ${new Date(complaintData.timestamp).toLocaleString()}</p>
            <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
              <a href="http://localhost:3000/admin.html" style="background: #BA0C2F; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold;">View in Admin Dashboard</a>
            </p>
          </div>
        </div>
      `
    };
    
    emailTransporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        log(`Email notification failed: ${err.message}`, 'WARN');
      } else {
        log(`Email notification sent for complaint ${complaintData.id}`, 'INFO');
      }
    });
  } catch (err) {
    log(`Error sending notification: ${err.message}`, 'ERROR');
  }
}

// ===== RATE LIMITING FUNCTIONS =====
function getComplaintTracker() {
  if (!fs.existsSync(COMPLAINT_TRACKER_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(COMPLAINT_TRACKER_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveComplaintTracker(tracker) {
  try {
    fs.writeFileSync(COMPLAINT_TRACKER_FILE, JSON.stringify(tracker, null, 2));
  } catch (err) {
    log(`Error saving complaint tracker: ${err.message}`, 'ERROR');
  }
}

function checkComplaintLimit(ip) {
  const tracker = getComplaintTracker();
  const today = new Date().toLocaleDateString();
  const record = tracker[ip];
  
  if (!record) return { allowed: true, remaining: MAX_COMPLAINTS_PER_DAY };
  
  // If date changed, reset counter
  if (record.date !== today) {
    tracker[ip] = { date: today, count: 0 };
    saveComplaintTracker(tracker);
    return { allowed: true, remaining: MAX_COMPLAINTS_PER_DAY };
  }
  
  // Check if limit exceeded
  if (record.count >= MAX_COMPLAINTS_PER_DAY) {
    return { allowed: false, remaining: 0 };
  }
  
  return { allowed: true, remaining: MAX_COMPLAINTS_PER_DAY - record.count };
}

function recordComplaint(ip) {
  const tracker = getComplaintTracker();
  const today = new Date().toLocaleDateString();
  
  if (!tracker[ip]) {
    tracker[ip] = { date: today, count: 1 };
  } else {
    const record = tracker[ip];
    if (record.date === today) {
      record.count += 1;
    } else {
      tracker[ip] = { date: today, count: 1 };
    }
  }
  
  saveComplaintTracker(tracker);
}

// ===== LOGIN SECURITY FUNCTIONS =====
// ===== LOGIN SECURITY FUNCTIONS =====
function getLoginAttempts() {
  if (!fs.existsSync(LOGIN_ATTEMPTS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(LOGIN_ATTEMPTS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveLoginAttempts(attempts) {
  fs.writeFileSync(LOGIN_ATTEMPTS_FILE, JSON.stringify(attempts, null, 2));
}

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.connection.remoteAddress || req.socket.remoteAddress || '0.0.0.0';
}

function isIPBlocked(ip) {
  const attempts = getLoginAttempts();
  const record = attempts[ip];
  if (!record) return false;
  
  // Check if lockout has expired
  const now = Date.now();
  if (now - record.lastFailedTime > LOCKOUT_DURATION) {
    delete attempts[ip];
    saveLoginAttempts(attempts);
    return false;
  }
  
  return record.failedAttempts >= MAX_LOGIN_ATTEMPTS;
}

function recordFailedAttempt(ip) {
  const attempts = getLoginAttempts();
  if (!attempts[ip]) {
    attempts[ip] = { failedAttempts: 0, lastFailedTime: Date.now(), blockedAt: null };
  }
  attempts[ip].failedAttempts += 1;
  attempts[ip].lastFailedTime = Date.now();
  
  // Record when IP was blocked
  if (attempts[ip].failedAttempts === MAX_LOGIN_ATTEMPTS) {
    attempts[ip].blockedAt = new Date().toISOString();
  }
  
  saveLoginAttempts(attempts);
}

function recordSuccessfulLogin(ip) {
  const attempts = getLoginAttempts();
  delete attempts[ip];
  saveLoginAttempts(attempts);
}

// ===== VISITOR TRACKING FUNCTIONS =====
const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');

function getVisitors() {
  if (!fs.existsSync(VISITORS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(VISITORS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveVisitors(visitors) {
  fs.writeFileSync(VISITORS_FILE, JSON.stringify(visitors, null, 2));
}

function recordVisit(req, page) {
  const visitors = getVisitors();
  const ip = getClientIP(req);
  const userAgent = req.headers['user-agent'] || 'Unknown';
  
  const visit = {
    timestamp: new Date().toISOString(),
    ip: ip,
    page: page,
    userAgent: userAgent,
    referer: req.headers['referer'] || 'Direct'
  };
  
  visitors.push(visit);
  
  // Keep only last 10,000 visits to avoid file getting too large
  if (visitors.length > 10000) {
    visitors.splice(0, visitors.length - 10000);
  }
  
  saveVisitors(visitors);
}

function getAnalytics() {
  const visitors = getVisitors();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisYear = new Date(now.getFullYear(), 0, 1);
  
  // Count unique IPs
  const uniqueIPs = new Set(visitors.map(v => v.ip));
  const todayVisits = visitors.filter(v => new Date(v.timestamp) >= today);
  const monthVisits = visitors.filter(v => new Date(v.timestamp) >= thisMonth);
  const yearVisits = visitors.filter(v => new Date(v.timestamp) >= thisYear);
  
  // Count by page
  const pageStats = {};
  visitors.forEach(v => {
    pageStats[v.page] = (pageStats[v.page] || 0) + 1;
  });
  
  // Count unique IPs by day (last 30 days)
  const dailyStats = {};
  visitors.forEach(v => {
    const date = new Date(v.timestamp).toLocaleDateString();
    dailyStats[date] = (dailyStats[date] || 0) + 1;
  });
  
  return {
    totalVisits: visitors.length,
    uniqueVisitors: uniqueIPs.size,
    todayVisits: todayVisits.length,
    monthVisits: monthVisits.length,
    yearVisits: yearVisits.length,
    pageStats: pageStats,
    dailyStats: dailyStats,
    lastVisits: visitors.slice(-20).reverse() // Last 20 visits
  };
}

// Middleware
app.use(compression()); // Gzip compression for faster loading
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname, { maxAge: '1d', etag: false })); // Cache static files

// ===== VISITOR TRACKING MIDDLEWARE =====
app.use((req, res, next) => {
  // Track visits to main pages
  const validPages = ['/', '/index.html', '/complaint.html', '/track.html', '/donate.html', '/admin.html'];
  if (validPages.includes(req.path)) {
    const page = req.path === '/' ? 'index.html' : req.path.replace('/', '');
    recordVisit(req, page);
  }
  next();
});

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
    const clientIP = getClientIP(req);
    
    // Check rate limit
    const limitCheck = checkComplaintLimit(clientIP);
    if (!limitCheck.allowed) {
      log(`Rate limit exceeded for IP ${clientIP}`, 'WARN');
      return res.status(429).json({ 
        success: false, 
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'You have reached the maximum of 5 complaints per day. Please try again tomorrow.',
        remaining: 0
      });
    }
    
    const id = uuidv4();
    const shortId = 'NCP-' + id.slice(0, 8).toUpperCase();
    
    let reporterName = (req.body.anonymous === 'Yes' ? 'Anonymous' : (req.body.name || 'Anonymous')).replace(/[^a-zA-Z0-9]/g, '_');
    if (reporterName.length > 20) reporterName = reporterName.substring(0, 20);
    const folderName = `${reporterName}_${shortId}`;
    const complaintDir = path.join(COMPLAINTS_DIR, folderName);
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
    
    // Record complaint for rate limiting
    recordComplaint(clientIP);
    
    // Send email notification
    sendNotificationEmail(complaint);
    
    log(`New complaint filed: ${shortId} from IP ${clientIP}`, 'INFO');
    
    res.json({ 
      success: true, 
      id: shortId,
      remaining: limitCheck.remaining - 1
    });
  } catch (err) {
    log(`Error saving complaint: ${err.message}`, 'ERROR');
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/complaints - Get all complaints (admin only) + Login attempt tracking
app.get('/api/complaints', (req, res) => {
  try {
    const pwd = req.headers['x-admin-password'];
  const clientIP = getClientIP(req);
  
  // Check if IP is blocked
  if (isIPBlocked(clientIP)) {
    const attempts = getLoginAttempts();
    const record = attempts[clientIP];
    const blockedAt = new Date(record.blockedAt);
    const unblockTime = new Date(blockedAt.getTime() + LOCKOUT_DURATION);
    return res.status(429).json({ 
      error: 'BLOCKED', 
      message: `Too many failed login attempts. Please try again after ${unblockTime.toLocaleTimeString()}.`,
      blockedUntil: unblockTime.toISOString()
    });
  }
  
  // Check password
  if (pwd !== ADMIN_PASSWORD) {
    recordFailedAttempt(clientIP);
    const attempts = getLoginAttempts();
    const remaining = MAX_LOGIN_ATTEMPTS - attempts[clientIP].failedAttempts;
    return res.status(401).json({ 
      error: 'WRONG_PASSWORD',
      message: remaining > 0 ? `Incorrect password. ${remaining} attempts remaining.` : `Too many failed attempts. Access blocked.`,
      attemptsRemaining: Math.max(0, remaining)
    });
  }
  
  // Correct password
  recordSuccessfulLogin(clientIP);
  
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
  } catch (err) {
    log(`Error getting complaints: ${err.message}`, 'ERROR');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/complaints/:id/status - Update status
app.patch('/api/complaints/:id/status', (req, res) => {
  const pwd = req.headers['x-admin-password'];
  if (pwd !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  if (!fs.existsSync(COMPLAINTS_DIR)) return res.status(404).json({ error: 'Not found' });
  const matchedDir = fs.readdirSync(COMPLAINTS_DIR).find(d => d.endsWith(id) || d === id);
  if (!matchedDir) return res.status(404).json({ error: 'Not found' });

  const complaintFile = path.join(COMPLAINTS_DIR, matchedDir, 'complaint.json');
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
  if (!fs.existsSync(COMPLAINTS_DIR)) return res.status(404).send('Not found');
  
  const matchedDir = fs.readdirSync(COMPLAINTS_DIR).find(d => d.endsWith(req.params.id) || d === req.params.id);
  if (!matchedDir) return res.status(404).send('Not found');

  const filePath = path.join(COMPLAINTS_DIR, matchedDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send('Not found');
  res.download(filePath);
});

// GET /api/check-status/:id - Citizen checks their complaint status
app.get('/api/check-status/:id', (req, res) => {
  if (!fs.existsSync(COMPLAINTS_DIR)) return res.status(404).json({ error: 'Complaint not found' });
  const matchedDir = fs.readdirSync(COMPLAINTS_DIR).find(d => d.endsWith(req.params.id) || d === req.params.id);
  if (!matchedDir) return res.status(404).json({ error: 'Complaint not found' });

  const complaintFile = path.join(COMPLAINTS_DIR, matchedDir, 'complaint.json');
  if (!fs.existsSync(complaintFile)) return res.status(404).json({ error: 'Complaint not found' });
  const c = JSON.parse(fs.readFileSync(complaintFile, 'utf8'));
  res.json({ id: c.id, title: c.title, category: c.category, status: c.status, timestamp: c.timestamp, location: c.location });
});

// GET /api/analytics - View site analytics (admin only)
app.get('/api/analytics', (req, res) => {
  const pwd = req.headers['x-admin-password'];
  if (pwd !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  
  const analytics = getAnalytics();
  res.json(analytics);
});

// ===== EXPORT/DOWNLOAD FUNCTIONS =====
function generateCSV(complaints) {
  if (!complaints || complaints.length === 0) return '';
  
  // CSV Header
  const headers = [
    'Complaint ID',
    'Date',
    'Status',
    'Urgency',
    'Province',
    'District',
    'Municipality',
    'Ward',
    'Tole',
    'Category',
    'Title',
    'Description',
    'Reporter Name',
    'Reporter Email',
    'Reporter Phone',
    'Is Anonymous',
    'Location Details'
  ];
  
  // CSV Rows
  const rows = complaints.map(c => [
    c.id,
    new Date(c.timestamp).toLocaleString(),
    c.status,
    c.urgency || 'Normal',
    c.location?.province || '',
    c.location?.district || '',
    c.location?.municipality || '',
    c.location?.ward || '',
    c.location?.tole || '',
    Array.isArray(c.categories) ? c.categories.join('; ') : (c.category || ''),
    c.title || '',
    (c.description || '').replace(/"/g, '""'), // Escape quotes
    c.reporter?.name || '',
    c.reporter?.email || '',
    c.reporter?.phone || '',
    c.reporter?.anonymous || 'No',
    c.location?.exactLocation || ''
  ]);
  
  // Format CSV with quoted fields
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(field => `"${field}"`).join(','))
  ].join('\n');
  
  return csvContent;
}

function generateJSON(complaints) {
  return JSON.stringify(complaints, null, 2);
}

// GET /api/export/complaints/csv - Download complaints as CSV
app.get('/api/export/complaints/csv', (req, res) => {
  const pwd = req.headers['x-admin-password'];
  if (pwd !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

  const complaints = [];
  if (!fs.existsSync(COMPLAINTS_DIR)) {
    res.setHeader('Content-Disposition', 'attachment; filename="complaints.csv"');
    return res.send('');
  }

  const dirs = fs.readdirSync(COMPLAINTS_DIR);
  dirs.forEach(dir => {
    const f = path.join(COMPLAINTS_DIR, dir, 'complaint.json');
    if (fs.existsSync(f)) {
      try { complaints.push(JSON.parse(fs.readFileSync(f, 'utf8'))); } catch (e) {}
    }
  });
  complaints.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const csv = generateCSV(complaints);
  const timestamp = new Date().toISOString().split('T')[0];
  res.setHeader('Content-Disposition', `attachment; filename="complaints_${timestamp}.csv"`);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.send('\ufeff' + csv); // Add BOM for Excel compatibility
});

// GET /api/export/complaints/json - Download complaints as JSON
app.get('/api/export/complaints/json', (req, res) => {
  const pwd = req.headers['x-admin-password'];
  if (pwd !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

  const complaints = [];
  if (!fs.existsSync(COMPLAINTS_DIR)) {
    res.setHeader('Content-Disposition', 'attachment; filename="complaints.json"');
    return res.json([]);
  }

  const dirs = fs.readdirSync(COMPLAINTS_DIR);
  dirs.forEach(dir => {
    const f = path.join(COMPLAINTS_DIR, dir, 'complaint.json');
    if (fs.existsSync(f)) {
      try { complaints.push(JSON.parse(fs.readFileSync(f, 'utf8'))); } catch (e) {}
    }
  });
  complaints.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const timestamp = new Date().toISOString().split('T')[0];
  res.setHeader('Content-Disposition', `attachment; filename="complaints_${timestamp}.json"`);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(generateJSON(complaints));
});

// POST /api/export/complaints/filtered - Download filtered complaints
app.post('/api/export/complaints/filtered', (req, res) => {
  const pwd = req.headers['x-admin-password'];
  if (pwd !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });

  const { format, filters } = req.body;
  const complaints = [];
  
  if (!fs.existsSync(COMPLAINTS_DIR)) {
    return res.json({ success: false, error: 'No complaints found' });
  }

  const dirs = fs.readdirSync(COMPLAINTS_DIR);
  dirs.forEach(dir => {
    const f = path.join(COMPLAINTS_DIR, dir, 'complaint.json');
    if (fs.existsSync(f)) {
      try { complaints.push(JSON.parse(fs.readFileSync(f, 'utf8'))); } catch (e) {}
    }
  });

  // Apply filters
  let filtered = complaints;
  if (filters) {
    if (filters.status) filtered = filtered.filter(c => c.status === filters.status);
    if (filters.province) filtered = filtered.filter(c => c.location?.province === filters.province);
    if (filters.category) filtered = filtered.filter(c => c.category === filters.category || (Array.isArray(c.categories) && c.categories.includes(filters.category)));
  }

  const timestamp = new Date().toISOString().split('T')[0];
  let content = '';
  let contentType = 'text/plain';
  let filename = `complaints_${timestamp}.txt`;

  if (format === 'csv') {
    content = generateCSV(filtered);
    contentType = 'text/csv; charset=utf-8';
    filename = `complaints_${timestamp}.csv`;
    content = '\ufeff' + content; // BOM for Excel
  } else if (format === 'json') {
    content = generateJSON(filtered);
    contentType = 'application/json; charset=utf-8';
    filename = `complaints_${timestamp}.json`;
  }

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', contentType);
  res.send(content);
});

// Add catch-all error handler
app.use((err, req, res, next) => {
  log(`Unhandled route error: ${err.message}`, 'ERROR');
  log(err.stack, 'ERROR');
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const server = app.listen(PORT, () => {
  log('====================================', 'INFO');
  log('Save Nepal From Corruption Server', 'INFO');
  log(`Running at http://localhost:${PORT}`, 'INFO');
  log(`Data stored in: ${DATA_DIR}`, 'INFO');
  log(`Max complaints per day: ${MAX_COMPLAINTS_PER_DAY}`, 'INFO');
  log('====================================', 'INFO');
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    log(`Port ${PORT} is already in use`, 'ERROR');
    process.exit(1);
  }
  log(`Server error: ${err.message}`, 'ERROR');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log('SIGTERM signal received: closing HTTP server', 'INFO');
  server.close(() => {
    log('HTTP server closed', 'INFO');
    process.exit(0);
  });
});
