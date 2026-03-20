# 🇳🇵 Save Nepal From Corruption — Setup & Usage Guide

## ✅ Step 1: Install Node.js (One-time setup)

1. Go to **https://nodejs.org**
2. Click **"Download LTS"** (the green button)
3. Run the installer → Click **Next** all the way through
4. **Restart your computer** after installation

---

## 🚀 Step 2: Start the Website

1. Open the folder: `C:\Users\User\Desktop\my website`
2. **Double-click** → `START_SERVER.bat`
3. A black window will appear and your browser will open automatically to **http://localhost:3000**
4. **Keep the black window open** while using the website (it's the server)

---

## 🖥️ Pages & Features

| Page | URL | Description |
|------|-----|-------------|
| 🏠 Home | http://localhost:3000 | Province overview, categories |
| 📝 Submit Issue | .../complaint.html | 4-step form with file uploads |
| 🔍 Track Issue | .../track.html | Check status with Complaint ID |
| 💛 Donate | .../donate.html | Bank & mobile payment details |
| 🔒 Admin | .../admin.html | View & manage all complaints |

---

## 🔒 Admin Dashboard

- Go to **http://localhost:3000/admin.html**
- Password: **`Rp369#og33`**
- You can: view all complaints, filter by province/district/category/status, download attachments, update status

---

## 💾 Where is Data Stored?

All data is saved on **your PC** at:
```
C:\Users\User\Desktop\my website\data\complaints\
```
Each complaint gets its own folder named `NCP-XXXXXXXX` containing:
- `complaint.json` — all details
- Uploaded files (photos, audio, documents)

---

## 💛 Donation Account

| Method | Details |
|--------|---------|
| Bank Account | **0245752280435001** (Rastriya Banijya Bank) |
| eSewa / Khalti / IME Pay | Update numbers in `donate.html` |

---

## 🛑 To Stop the Server

Press `CTRL + C` in the black server window.
