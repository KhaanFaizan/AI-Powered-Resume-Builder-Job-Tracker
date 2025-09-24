# 🌐 Frontend Deployment Guide

This guide will help you deploy your React frontend and connect it to your deployed backend on Render.

## 🔗 Backend Connection Setup

### 1. Get Your Backend URL
After deploying your backend on Render, you'll get a URL like:
```
https://ai-resume-builder-api.onrender.com
```

### 2. Update Frontend Configuration

#### Option A: Environment Variable (Recommended)
1. **For Local Development:**
   Create `client/.env.local`:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

2. **For Production:**
   Create `client/.env.production`:
   ```env
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

#### Option B: Update Config File
Edit `client/src/config/config.js`:
```javascript
const config = {
  development: {
    API_URL: 'http://localhost:5000'
  },
  production: {
    // Replace with your actual Render backend URL
    API_URL: 'https://your-backend-url.onrender.com'
  }
};
```

### 3. Test Backend Connection

Test your backend is working:
```bash
# Test health endpoint
curl https://your-backend-url.onrender.com/health

# Should return:
# {"message":"Server is running","timestamp":"2024-01-01T00:00:00.000Z","database":"Connected"}
```

## 🚀 Deploy Frontend on Render

### Method 1: Static Site (Recommended)

1. **Go to Render Dashboard**
   - Visit [render.com/dashboard](https://render.com/dashboard)
   - Click "New +" → "Static Site"

2. **Connect Repository**
   - Connect your GitHub repository
   - Select the repository with your code

3. **Configure Build Settings**
   ```
   Name: ai-resume-builder-web
   Environment: Static Site
   Region: Choose closest to your users
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

4. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

5. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete

### Method 2: Web Service

1. **Go to Render Dashboard**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   ```
   Name: ai-resume-builder-web
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build && npm install -g serve
   Start Command: serve -s build -l 3000
   ```

3. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   PORT=3000
   ```

## 🔧 Post-Deployment Configuration

### 1. Update CORS in Backend

Make sure your backend allows your frontend domain:

In `server/server.js`:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.onrender.com'
  ],
  credentials: true
};
```

### 2. Test Full Application

1. **Visit your frontend URL**
2. **Try to register a new user**
3. **Test the AI analysis feature**
4. **Check job tracker functionality**

### 3. Update URLs in Documentation

Update these files with your actual URLs:
- `README.md`
- `client/public/sitemap.xml`
- `client/public/robots.txt`

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Ensure frontend URL is in allowed origins

2. **API Connection Failed**
   - Verify backend URL is correct
   - Check if backend is running
   - Test backend endpoints directly

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check build logs for specific errors

4. **Environment Variables Not Working**
   - Ensure variables start with `REACT_APP_`
   - Restart the build process
   - Check variable names are correct

### Debug Steps

1. **Check Backend Health**
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```

2. **Check Frontend Console**
   - Open browser developer tools
   - Check for network errors
   - Look for API call failures

3. **Verify Environment Variables**
   - Add `console.log(process.env.REACT_APP_API_URL)` in your code
   - Check if the variable is loaded correctly

## 📊 Monitoring

### 1. Render Dashboard
- Monitor both frontend and backend services
- Check logs for errors
- Monitor resource usage

### 2. Application Monitoring
- Test all features after deployment
- Monitor user registrations
- Check AI analysis functionality

## 🔄 Updates

### 1. Updating Frontend
- Push changes to GitHub
- Render will automatically redeploy
- Monitor deployment logs

### 2. Updating Backend
- Push changes to GitHub
- Backend will automatically redeploy
- Test frontend still works

## 🎉 Success!

Once deployed, your AI Resume Builder will be live at:
- **Frontend**: `https://your-frontend-url.onrender.com`
- **Backend**: `https://your-backend-url.onrender.com`

### Final Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] All features working
- [ ] URLs updated in documentation

---

## 🆘 Need Help?

If you encounter issues:
1. Check the deployment logs in Render dashboard
2. Test backend endpoints directly
3. Check browser console for errors
4. Verify environment variables are set correctly
