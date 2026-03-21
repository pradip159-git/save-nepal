# Save Nepal From Corruption - Deployment Guide

## 🚀 Quick Deployment to Render.com (FREE)

### Prerequisites:
- ✅ Domain registered (e.g., savenepal.org.np)
- ✅ GitHub account
- ✅ Render.com account

### Step 1: Prepare Your Code for GitHub
1. Go to https://github.com and create a new repository
2. Name it: `savenepal-portal`
3. Upload all your website files:
   - `server.js`
   - `package.json`
   - `config.js`
   - All HTML files (`index.html`, `complaint.html`, etc.)
   - `js/` folder
   - `styles/` folder
   - `data/` folder (will be created automatically)

### Step 2: Deploy on Render
1. Go to https://render.com
2. Sign in with your Gmail
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure build settings:
   - **Environment:** Node.js
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node Version:** 18 or later

### Step 3: Environment Variables (Important!)
Add these environment variables in Render dashboard:

```
EMAIL_USER=pradipchand714@gmail.com
EMAIL_PASS=swbo jcrk vlwt hymw
NODE_ENV=production
PORT=10000
```

### Step 4: Connect Your Domain
1. In Render dashboard, go to your service settings
2. Add custom domain: `savenepal.org.np`
3. Copy the DNS records provided
4. Go to your domain registrar (Namecheap)
5. Update DNS settings with the records from Render

### Step 5: Go Live!
- Your website will be live at: `https://savenepal.org.np`
- SSL certificate is automatic and free
- 24/7 uptime on free tier

## 🔧 Production Configuration

Your `config.js` is already configured for production:
- Email notifications: ✅ Enabled
- Rate limiting: ✅ Active (5 complaints/day)
- Error handling: ✅ Comprehensive

## 📊 Monitoring

- Check Render logs for any issues
- Email notifications will alert you to new complaints
- Server logs saved to `data/server-logs.txt`

## 🎯 Success Checklist

- [ ] Domain registered
- [ ] GitHub repository created
- [ ] Code uploaded to GitHub
- [ ] Render account created
- [ ] Web service deployed
- [ ] Environment variables set
- [ ] Custom domain connected
- [ ] SSL certificate active
- [ ] Test complaint submission
- [ ] Verify email notifications

## 🆘 Troubleshooting

**If deployment fails:**
1. Check Render build logs
2. Ensure all dependencies are in package.json
3. Verify environment variables are set correctly

**If emails don't work:**
1. Check environment variables in Render
2. Verify Gmail app password is correct
3. Check Render logs for email errors

## 📞 Support

Your website is production-ready! Contact me if you need help with any step.

**Final URL:** `https://savenepal.org.np` 🇳🇵