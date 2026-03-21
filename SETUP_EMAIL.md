# Email Notifications & Rate Limiting Setup Guide

## ✅ What's Now Ready

- **Email notifications** when complaints are filed
- **Rate limiting** (5 complaints per person per day)
- **Server stability** with error handling and logging

---

## 📧 Step 1: Get Your Gmail App Password

**This is required for email notifications to work!**

### Option A: Using Gmail (Recommended - FREE)

1. Go to: https://myaccount.google.com/security
2. Click **"2-Step Verification"** and set it up if not already done
3. Go back to Security settings
4. Find **"App passwords"** (appears after 2FA is enabled)
5. Select:
   - App: **Mail**
   - Device: **Windows Computer**
6. Google shows a 16-character password
7. **Copy this password** (you'll need it in Step 2)

### Option B: Using Another Email Service

You can use:
- **Outlook/Hotmail** - Generate app-specific password
- **Yahoo Mail** - Generate app password
- **Custom SMTP** - Ask your email provider for SMTP details

---

## ⚙️ Step 2: Configure Email in `config.js`

1. Open `config.js` in your project
2. Fill in your details:

```javascript
module.exports = {
  email: {
    enabled: true,  // ← Change this to TRUE
    
    service: 'gmail',
    user: 'your-actual-email@gmail.com',    // Your Gmail address
    pass: 'xxxx xxxx xxxx xxxx',             // 16-char app password
    recipient: 'your-email@gmail.com',      // Where to send notifications
  },
  
  rateLimit: {
    maxComplaintsPerDay: 5,  // Change this if you want different limit
  }
};
```

**Example with real values:**
```javascript
module.exports = {
  email: {
    enabled: true,
    service: 'gmail',
    user: 'admin@savenepal.com',
    pass: 'abcd efgh ijkl mnop',
    recipient: 'admin@savenepal.com',
  },
  rateLimit: {
    maxComplaintsPerDay: 5,
  }
};
```

---

## 🚀 Step 3: Restart Your Server

1. **Stop** the current server (Ctrl+C in terminal)
2. **Start** it again: `node server.js`

You should see in the terminal:
```
[2024-XX-XX] [INFO] Server running on http://localhost:3000
```

---

## ✨ Testing Email Notifications

1. Go to http://localhost:3000/complaint.html
2. Fill in and submit a test complaint
3. **Check your email** (check spam folder too!)
4. You should receive an email like:

```
From: your-email@gmail.com
Subject: 🚨 New Complaint Filed: [Complaint ID]

New Complaint Received ✓
Complaint ID: abc123
Title: [Your test title]
Category: [Your category]
... and more details
```

---

## 🛑 Testing Rate Limiting

1. Submit **5 complaints** from the complaint form
2. Try to submit a **6th complaint**
3. You should see the message:
   > "You have reached the maximum of 5 complaints per day. Please try again tomorrow."

---

## 🔒 View Your Logs

All server activity is logged to: `data/server-logs.txt`

Open it to see:
- When emails were sent
- Rate limit violations
- Any errors that occurred

---

## 🐛 Troubleshooting

### **"Email notifications failed: connect ECONNREFUSED"**
- Your Gmail app password is wrong
- Or Gmail hasn't authorized the app yet
- **Fix:** Double-check the password in `config.js`

### **"Email notifications disabled" message**
- You haven't set `enabled: true` in `config.js`
- **Fix:** Open `config.js` and change `enabled: false` → `enabled: true`

### **Not receiving emails?**
1. Check your **spam/junk folder**
2. Check if the email was sent:
   - Open `data/server-logs.txt`
   - Look for "Email notification sent"
3. Verify Gmail settings:
   - Go to: https://myaccount.google.com/lesssecureapps
   - Enable "Allow less secure apps" (if available)

### **Rate limit not working?**
1. Check `data/complaint-tracker.json` exists
2. Clear it to reset: `data/complaint-tracker.json` → `{}`
3. Restart server

---

## 📊 Monitor Live Activity

Watch the server logs in real-time:

**Windows (PowerShell):**
```powershell
Get-Content -Path "data/server-logs.txt" -Tail 20 -Wait
```

**Command Prompt:**
```cmd
type data\server-logs.txt
```

---

## 🔐 Security Notes

- **Never commit `config.js`** with real credentials to Git
- Consider using **environment variables** for production:
  ```
  setx EMAIL_USER "your-email@gmail.com"
  setx EMAIL_PASS "your-app-password"
  ```
- **Gmail app passwords** are safer than your main password
- Always use **2-Factor Authentication** on your email account

---

## ✅ Checklist Before Going Live

- [ ] Gmail app password generated
- [ ] `config.js` filled with your email and password
- [ ] `enabled: true` in `config.js`
- [ ] Server restarted after config changes
- [ ] Test email received successfully
- [ ] Rate limiting tested (tried 6 complaints)
- [ ] `data/server-logs.txt` shows no errors

---

## 📞 Need Help with Your Domain?

When ready, ask me about:
1. **How to register a domain** (.com, .np, .org)
2. **How to deploy on free hosting** (Render, Railway, Netlify)
3. **How to connect domain to your site**

Let me know once email notifications are working! 🎉
