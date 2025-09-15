# 📋 Quick Deployment Checklist

## Pre-Deployment ✅

- [ ] Code pushed to GitHub repository
- [ ] MongoDB Atlas database is accessible
- [ ] Brevo SMTP credentials are working
- [ ] Both Railway and Vercel accounts are ready

## Backend (Railway) 🚂

- [ ] Create new Railway project from GitHub repo
- [ ] Set root directory to `/Server`
- [ ] Add environment variables:
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL` (will update after frontend deployment)
- [ ] Deploy and get Railway URL
- [ ] Test health endpoint: `/`

## Frontend (Vercel) ⚡

- [ ] Create new Vercel project from GitHub repo
- [ ] Set root directory to `/client/vite-project`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL` (Railway backend URL + `/api`)
- [ ] Deploy and get Vercel URL
- [ ] Test frontend loads correctly

## Final Configuration 🔄

- [ ] Update `FRONTEND_URL` in Railway with actual Vercel domain
- [ ] Redeploy Railway backend
- [ ] Test full authentication flow
- [ ] Verify all features work in production

## Live URLs 🌐

- **Frontend**: https://your-app-name.vercel.app
- **Backend**: https://your-app-name.railway.app
- **Health Check**: https://your-app-name.railway.app/

## Test Features ✅

- [ ] User registration
- [ ] Email verification
- [ ] User login
- [ ] Password reset
- [ ] Dashboard access
- [ ] Logout functionality

---

_Deployment completed successfully!_ 🎉
