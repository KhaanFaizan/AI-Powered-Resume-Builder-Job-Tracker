# 🚀 Deployment Guide for Render

This guide will help you deploy your AI Resume Builder application on Render.

## 📋 Prerequisites

1. **GitHub Repository** - Your code should be pushed to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas** - Set up a MongoDB Atlas cluster
4. **HuggingFace Account** - Get your API key from [huggingface.co](https://huggingface.co)

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Choose the free tier (M0)
   - Select a region close to your users
   - Create the cluster

3. **Configure Database Access**
   - Go to "Database Access"
   - Add a new database user
   - Set username and password
   - Give "Read and write to any database" permissions

4. **Configure Network Access**
   - Go to "Network Access"
   - Add IP address: `0.0.0.0/0` (allow all IPs)
   - Or add Render's IP ranges

5. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## 🤖 HuggingFace API Setup

1. **Create HuggingFace Account**
   - Go to [huggingface.co](https://huggingface.co)
   - Sign up for a free account

2. **Get API Token**
   - Go to Settings → Access Tokens
   - Create a new token
   - Copy the token (starts with `hf_`)

## 🚀 Deploy Backend (API)

### Method 1: Using Render Dashboard

1. **Create New Web Service**
   - Go to [render.com/dashboard](https://render.com/dashboard)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend Service**
   ```
   Name: ai-resume-builder-api
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   PORT=10000
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the service URL (e.g., `https://ai-resume-builder-api.onrender.com`)

### Method 2: Using render.yaml

1. **Push render.yaml to GitHub**
   - The `render.yaml` file is already configured
   - Push your code to GitHub

2. **Deploy from Blueprint**
   - Go to [render.com/dashboard](https://render.com/dashboard)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository with `render.yaml`
   - Click "Apply"

## 🌐 Deploy Frontend (Web App)

### Method 1: Using Render Dashboard

1. **Create New Static Site**
   - Go to [render.com/dashboard](https://render.com/dashboard)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend Service**
   ```
   Name: ai-resume-builder-web
   Environment: Static Site
   Region: Choose closest to your users
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

3. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Note the site URL (e.g., `https://ai-resume-builder-web.onrender.com`)

### Method 2: Using render.yaml

The `render.yaml` file already includes frontend configuration. If using the Blueprint method, both services will be deployed automatically.

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings

Update your backend `server.js` to allow your frontend domain:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.onrender.com'
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

### 2. Update Frontend API URL

Update your frontend to use the production API URL:

```javascript
// In your API calls, use:
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### 3. Test Your Deployment

1. **Test Backend**
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"message":"Server is running"}`

2. **Test Frontend**
   - Visit your frontend URL
   - Try registering a new user
   - Test the AI analysis feature

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files to GitHub
- Use Render's environment variable settings
- Use strong, unique JWT secrets

### 2. Database Security
- Use MongoDB Atlas security features
- Enable IP whitelisting if needed
- Use strong database passwords

### 3. API Security
- Implement rate limiting
- Add request validation
- Use HTTPS in production

## 📊 Monitoring

### 1. Render Dashboard
- Monitor service health
- Check logs for errors
- Monitor resource usage

### 2. MongoDB Atlas
- Monitor database performance
- Check connection metrics
- Set up alerts

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has correct permissions

3. **CORS Issues**
   - Update CORS settings to include frontend URL
   - Check environment variables

4. **Environment Variable Issues**
   - Verify all required variables are set
   - Check variable names and values
   - Restart services after changes

### Getting Help

1. **Render Documentation**: [render.com/docs](https://render.com/docs)
2. **MongoDB Atlas Support**: [support.mongodb.com](https://support.mongodb.com)
3. **GitHub Issues**: Create an issue in your repository

## 🔄 Updates and Maintenance

### 1. Updating Your App
- Push changes to GitHub
- Render will automatically redeploy
- Monitor deployment logs

### 2. Database Backups
- MongoDB Atlas provides automatic backups
- Consider manual backups for important data

### 3. Monitoring
- Set up alerts for service downtime
- Monitor resource usage
- Check logs regularly

## 📈 Scaling

### 1. Upgrade Plans
- Render offers paid plans for better performance
- Consider upgrading for production use

### 2. Database Scaling
- MongoDB Atlas offers scaling options
- Consider upgrading for better performance

### 3. CDN
- Use Render's CDN for static assets
- Consider external CDN for global performance

---

## 🎉 Congratulations!

Your AI Resume Builder is now live on Render! 

- **Frontend**: `https://your-frontend-url.onrender.com`
- **Backend**: `https://your-backend-url.onrender.com`
- **Database**: MongoDB Atlas

Remember to update the URLs in your README.md file with your actual Render URLs.
