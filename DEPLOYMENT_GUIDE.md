# 🚀 Deployment Guide - Railway + Vercel

## 📋 Deployment Strategy

- **Backend (Node.js)** → Railway
- **Frontend (React)** → Vercel
- **Admin Dashboard (React)** → Vercel
- **Database** → MongoDB Atlas (already setup)

---

## 🚂 Part 1: Deploy Backend on Railway

### Step 1: Prepare Backend for Deployment

#### 1.1 Update `backend/package.json`

Add start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

#### 1.2 Update CORS in `backend/server.js`

```javascript
// Update CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://your-frontend.vercel.app',
    'https://your-admin.vercel.app'
  ],
  credentials: true,
  exposedHeaders: ['Content-Length', 'Content-Type']
}));
```

### Step 2: Deploy to Railway

1. **Go to Railway**: https://railway.app/
2. **Sign up/Login** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select Repository**: `Abrar-141/portfolio`
5. **Select Root Directory**: Choose `backend` folder
6. **Add Environment Variables**:
   ```
   PORT=5001
   MONGODB_URI=mongodb+srv://Portfolio:Abrar4321.@cluster0.espappa.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=portfolio-secret-key-2024-production
   EMAIL_USER=abrariqbal141@gmail.com
   EMAIL_PASS=your-app-password
   NODE_ENV=production
   ```
7. **Deploy** button click karo

### Step 3: Get Railway Backend URL

After deployment:
- Railway will give you a URL like: `https://your-backend.railway.app`
- Copy this URL - frontend mein use karenge

---

## ☁️ Part 2: Deploy Frontend on Vercel

### Step 1: Prepare Frontend

#### 1.1 Create `frontend/vercel.json`

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
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### 1.2 Update API URLs in Frontend

Create `frontend/src/config/api.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export default API_URL;
```

Update all fetch calls to use:
```javascript
import API_URL from '../config/api';

fetch(`${API_URL}/api/home`)
```

#### 1.3 Add Build Script in `frontend/package.json`

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "vercel-build": "react-scripts build"
  }
}
```

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com/
2. **Sign up/Login** with GitHub
3. **New Project** → **Import Git Repository**
4. **Select**: `Abrar-141/portfolio`
5. **Configure Project**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```
7. **Deploy** button click karo

---

## 🎛️ Part 3: Deploy Admin Dashboard on Vercel

### Step 1: Prepare Admin Dashboard

#### 1.1 Create `admin/vercel.json`

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
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### 1.2 Update API URLs in Admin

Update `admin/src/config/api.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export default API_URL;
```

Update all fetch calls in AdminDashboard.jsx, Login.jsx, Signup.jsx

### Step 2: Deploy Admin to Vercel

1. **Vercel Dashboard** → **New Project**
2. **Import**: `Abrar-141/portfolio`
3. **Configure**:
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```
5. **Deploy**

---

## 🔧 Part 4: Update Backend CORS

After getting Vercel URLs, update Railway backend:

1. **Railway Dashboard** → Your Project → **Variables**
2. Add:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ADMIN_URL=https://your-admin.vercel.app
   ```

3. Update `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));
```

4. **Redeploy** backend on Railway

---

## 📝 Part 5: Update Invite Links

Update `backend/server.js` invite link generation:

```javascript
// Generate Invite Token
app.post('/api/admin/generate-invite', authMiddleware, async (req, res) => {
  // ...
  const adminUrl = process.env.ADMIN_URL || 'http://localhost:3001';
  const inviteLink = `${adminUrl}/signup?token=${token}&email=${encodeURIComponent(email)}`;
  // ...
});
```

---

## ✅ Deployment Checklist

### Railway (Backend)
- [ ] Backend deployed successfully
- [ ] Environment variables added
- [ ] Database connected
- [ ] Backend URL copied

### Vercel (Frontend)
- [ ] Frontend deployed
- [ ] API_URL environment variable set
- [ ] All pages working
- [ ] Images loading correctly

### Vercel (Admin)
- [ ] Admin deployed
- [ ] API_URL environment variable set
- [ ] Login working
- [ ] Dashboard accessible

### Final Steps
- [ ] Update CORS in backend
- [ ] Test invite link generation
- [ ] Test contact form
- [ ] Test file uploads
- [ ] Test all API endpoints

---

## 🌐 Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://your-portfolio.vercel.app`
- **Admin**: `https://your-admin.vercel.app`
- **Backend**: `https://your-backend.railway.app`

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Solution**: Update CORS origins in backend with exact Vercel URLs

### Issue 2: API Not Found
**Solution**: Check REACT_APP_API_URL environment variable

### Issue 3: Images Not Loading
**Solution**: Update image paths to use backend URL

### Issue 4: Build Failed
**Solution**: Check package.json scripts and dependencies

### Issue 5: Environment Variables Not Working
**Solution**: Redeploy after adding environment variables

---

## 🔄 Redeployment

### Update Code:
```bash
git add .
git commit -m "Update for production"
git push origin main
```

- **Railway**: Auto-deploys on push
- **Vercel**: Auto-deploys on push

---

## 📊 Monitoring

### Railway
- View logs in Railway dashboard
- Monitor resource usage
- Check deployment status

### Vercel
- View deployment logs
- Check analytics
- Monitor performance

---

## 💰 Pricing

### Railway
- **Free Tier**: $5 credit/month
- **Hobby**: $5/month
- **Pro**: $20/month

### Vercel
- **Hobby**: Free (personal projects)
- **Pro**: $20/month (commercial)

### MongoDB Atlas
- **Free Tier**: 512MB storage
- **Shared**: $9/month

---

## 🎯 Next Steps

1. Deploy backend to Railway
2. Get Railway backend URL
3. Deploy frontend to Vercel
4. Deploy admin to Vercel
5. Update CORS settings
6. Test everything
7. Share your live portfolio! 🚀

---

**Need help? Let me know!** 💪
