# 🚀 MERN Authentication App Deployment Guide

Deploy your MERN authentication application with **Railway** for the backend and **Vercel** for the frontend.

## 📋 Prerequisites

- GitHub account (for code repository)
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- MongoDB Atlas database (already configured)
- Brevo SMTP credentials (already configured)

## 🎯 Deployment Overview

- **Backend**: Node.js/Express API → Railway
- **Frontend**: React/Vite App → Vercel
- **Database**: MongoDB Atlas (already set up)
- **Email**: Brevo SMTP (already configured)

---

## 🔧 Step 1: Prepare Your Repository

### 1.1 Push to GitHub

If not already done, create a GitHub repository:

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - MERN Auth App"

# Add remote origin (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/mern-authentication.git
git branch -M main
git push -u origin main
```

### 1.2 Repository Structure

```
mern-authentication/
├── Server/                    # Backend (Railway)
│   ├── package.json          # ✅ Updated for Railway
│   ├── server.js             # ✅ CORS configured
│   ├── railway.json          # ✅ Railway config
│   ├── .env.railway          # 📝 Environment template
│   └── ...
└── client/vite-project/       # Frontend (Vercel)
    ├── package.json          # ✅ Updated for Vercel
    ├── vercel.json           # ✅ Vercel config
    ├── .env.production       # 📝 Environment template
    └── ...
```

---

## 🚂 Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose the **Server** folder as root directory

### 2.2 Configure Environment Variables

In Railway project settings → Variables, add:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-auth

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (Brevo SMTP)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email@domain.com
SMTP_PASS=your-brevo-smtp-key

# Application Settings
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
```

### 2.3 Deploy Backend

1. Railway will automatically detect the Node.js project
2. It will run `npm install` and `npm start`
3. Wait for deployment to complete
4. **Copy the Railway domain** (e.g., `https://your-app-name.railway.app`)

---

## ⚡ Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" → Import your GitHub repository
3. Configure project:
   - **Root Directory**: `client/vite-project`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Configure Environment Variables

In Vercel project settings → Environment Variables, add:

```env
# Production API URL (replace with your Railway URL)
VITE_API_URL=https://your-railway-app.railway.app/api
```

### 3.3 Deploy Frontend

1. Click "Deploy"
2. Vercel will build and deploy automatically
3. **Copy the Vercel domain** (e.g., `https://your-app-name.vercel.app`)

---

## 🔄 Step 4: Update CORS Configuration

### 4.1 Update Backend CORS

1. Go back to Railway project
2. Update the `FRONTEND_URL` environment variable with your actual Vercel domain:
   ```env
   FRONTEND_URL=https://your-actual-vercel-app.vercel.app
   ```
3. Redeploy the Railway service

### 4.2 Verify Configuration

The backend `server.js` is already configured with:

```javascript
cors({
  credentials: true,
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
  ],
});
```

---

## ✅ Step 5: Test Your Deployment

### 5.1 Backend Health Check

Visit your Railway URL: `https://your-app-name.railway.app`

Expected response:

```json
{
  "message": "🚀 MERN Auth API is working!"
}
```

### 5.2 Frontend Application

Visit your Vercel URL: `https://your-app-name.vercel.app`

Test all features:

- ✅ User registration
- ✅ Email verification
- ✅ Login/logout
- ✅ Password reset
- ✅ Dashboard access

---

## 🔧 Step 6: Environment Variables Checklist

### Railway (Backend)

- [ ] `MONGODB_URI` - Your MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Strong secret key for JWT tokens
- [ ] `SMTP_HOST` - smtp-relay.brevo.com
- [ ] `SMTP_PORT` - 587
- [ ] `SMTP_USER` - Your Brevo email
- [ ] `SMTP_PASS` - Your Brevo SMTP key
- [ ] `NODE_ENV` - production
- [ ] `FRONTEND_URL` - Your Vercel domain

### Vercel (Frontend)

- [ ] `VITE_API_URL` - Your Railway backend API URL

---

## 🚨 Troubleshooting

### Common Issues

#### 1. CORS Errors

- Ensure `FRONTEND_URL` in Railway matches your Vercel domain exactly
- Check that credentials are included in requests

#### 2. API Connection Failed

- Verify `VITE_API_URL` in Vercel matches your Railway domain
- Ensure Railway backend is deployed and accessible

#### 3. Email Not Sending

- Verify Brevo SMTP credentials in Railway
- Check Brevo account status and quota

#### 4. Database Connection Issues

- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas (should include 0.0.0.0/0 for Railway)

### Logs and Debugging

**Railway Logs:**

- Go to Railway project → Deployments → View logs

**Vercel Logs:**

- Go to Vercel project → Functions → View function logs

---

## 🔄 Step 7: Continuous Deployment

### Automatic Deployments

Both Railway and Vercel are configured for automatic deployments:

- **Push to `main` branch** → Automatically deploys backend to Railway
- **Push to `main` branch** → Automatically deploys frontend to Vercel

### Manual Redeploys

- **Railway**: Go to project → Deployments → Redeploy
- **Vercel**: Go to project → Deployments → Redeploy

---

## 🎉 Success!

Your MERN authentication application is now live:

- **Frontend**: https://your-app-name.vercel.app
- **Backend**: https://your-app-name.railway.app
- **Database**: MongoDB Atlas
- **Email**: Brevo SMTP

### Features Available:

✅ Modern UI with enhanced design  
✅ User registration and login  
✅ Email verification with OTP  
✅ Password reset functionality  
✅ JWT-based authentication  
✅ Secure session management

---

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review deployment logs in Railway and Vercel
3. Verify all environment variables are set correctly
4. Ensure your MongoDB Atlas and Brevo services are active

Happy coding! 🚀
