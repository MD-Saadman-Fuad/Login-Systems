# Manual Vercel Deployment Guide

## 🎯 Option 1: Using Vercel CLI (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Navigate to Frontend Directory
```bash
cd "E:\Login Systems\frontend"
```

### Step 3: Login to Vercel
```bash
vercel login
# Follow the authentication process in your browser
```

### Step 4: Initialize and Configure
```bash
vercel
# Answer the setup questions:
# ? Set up and deploy "frontend"? [Y/n] Y
# ? Which scope? [Your username/team]
# ? Link to existing project? [Y/n] N
# ? What's your project's name? mern-login-frontend
# ? In which directory is your code located? ./
```

### Step 5: Set Environment Variables
```bash
# Set production API URL
vercel env add REACT_APP_API_URL production
# Enter: https://your-backend-domain.com/api

vercel env add REACT_APP_ENV production
# Enter: production
```

### Step 6: Deploy
```bash
# Deploy to production
vercel --prod

# Or deploy for preview first
vercel
```

### Step 7: View Your Deployed App
```bash
# Open in browser
vercel open
```

---

## 🌐 Option 2: Vercel Dashboard (Manual Upload)

### Step 1: Build Your React App
```bash
cd "E:\Login Systems\frontend"
npm run build
```

### Step 2: Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Click "Add New..." → "Project"

### Step 3: Manual Upload
- Choose "Import Third-Party Git Repository"
- Or drag and drop your `build` folder
- Or use "Browse" to select the `build` folder

### Step 4: Configure Project
- Project Name: `mern-login-frontend`
- Framework Preset: `Create React App`
- Root Directory: `./` (or point to build folder)

### Step 5: Set Environment Variables
In Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add: `REACT_APP_API_URL` = `https://your-backend-domain.com/api`
- Add: `REACT_APP_ENV` = `production`

### Step 6: Deploy
- Click "Deploy"
- Wait for build to complete

---

## 🔧 Pre-Deployment Setup

### Update Environment Files
Before deploying, ensure your environment is configured:

1. **Check your current frontend/.env.production:**
```bash
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_ENV=production
```

2. **Test local build:**
```bash
cd frontend
npm run build
npx serve -s build
# Test at http://localhost:3000
```

---

## 📋 Deployment Checklist

### Before Running Vercel Commands:
- [ ] Backend is deployed and accessible
- [ ] Environment variables are set correctly
- [ ] Local build works: `npm run build`
- [ ] All 6 modules tested locally

### During Deployment:
- [ ] Choose correct project settings
- [ ] Set environment variables in Vercel
- [ ] Verify build logs for errors
- [ ] Test deployment URL

### After Deployment:
- [ ] Test all 6 registration modules
- [ ] Verify API calls reach backend
- [ ] Check browser console for errors
- [ ] Test mobile responsiveness

---

## 🛠️ Troubleshooting

### Build Failures:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for missing dependencies
npm run build
```

### Environment Variable Issues:
```bash
# Verify variables are set
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

### API Connection Issues:
- Ensure `REACT_APP_API_URL` points to deployed backend
- Check CORS settings in backend
- Verify backend is accessible via browser

---

## 🚀 Quick Commands Summary

```bash
# Full deployment flow
cd "E:\Login Systems\frontend"
npm install
npm run build
vercel login
vercel
# Follow prompts, set environment variables
vercel --prod
```

### Subsequent Deployments:
```bash
cd "E:\Login Systems\frontend"
vercel --prod
# Automatic deployment of latest changes
```

---

## 📱 Alternative: Drag & Drop Method

If CLI doesn't work:

1. **Build locally:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Zip the build folder:**
   - Right-click on `build` folder
   - Create ZIP archive

3. **Upload to Vercel:**
   - Go to vercel.com/new
   - Drag and drop the ZIP file
   - Configure settings and deploy

---

## 🔄 Automatic Deployments (Optional)

### Connect GitHub for Auto-Deploy:
1. Push your code to GitHub
2. In Vercel dashboard: "Import Git Repository"
3. Connect your GitHub repo
4. Set branch to deploy (main/master)
5. Configure build settings
6. Every git push will auto-deploy

### Vercel Configuration File:
Create `vercel.json` in frontend root (already created):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

This ensures React Router works correctly in production!