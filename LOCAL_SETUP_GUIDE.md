# 🚀 FlashWork Local Setup Guide

## Prerequisites

Before you start, make sure you have:
- ✅ Node.js (v18 or higher) - Check with `node --version`
- ✅ npm (comes with Node.js) - Check with `npm --version`
- ✅ Git (for version control)
- ✅ A code editor (VS Code recommended)

## Quick Start (5 Minutes)

### Step 1: Install Backend Dependencies

```bash
cd flashwork/backend
npm install
```

This will:
- Install all required packages
- Generate Prisma Client automatically
- Set up the database connection

### Step 2: Verify Environment Variables

Check that `flashwork/backend/.env` exists and contains:

```env
DATABASE_URL="postgresql://neondb_owner:npg_okNiC3cWFlx7@ep-raspy-cherry-a1q5clhl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://neondb_owner:npg_okNiC3cWFlx7@ep-raspy-cherry-a1q5clhl.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="your-secret-key-here-change-in-production"
PORT=5000
```

✅ **Good news:** Your .env file is already configured!

### Step 3: Run Database Migrations (Optional)

If you need to apply database migrations:

```bash
npm run migrate
```

### Step 4: Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

You should see:
```
Server running on port 5000
Database connected successfully
```

### Step 5: Open the Frontend

Open a new terminal and navigate to the frontend:

```bash
cd flashwork/frontend
```

Then open `index.html` in your browser:

**Option A: Using Live Server (Recommended)**
- Install "Live Server" extension in VS Code
- Right-click on `index.html`
- Select "Open with Live Server"

**Option B: Direct File Open**
- Navigate to `flashwork/frontend/index.html`
- Double-click to open in your default browser

**Option C: Using Python HTTP Server**
```bash
python -m http.server 8000
```
Then open: http://localhost:8000

## 🎯 Access Your Application

- **Frontend**: http://localhost:5500 (Live Server) or http://localhost:8000 (Python)
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health (if you have this endpoint)

## 📁 Project Structure

```
flashwork/
├── backend/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth and validation
│   ├── routes/          # API endpoints
│   ├── prisma/          # Database schema and migrations
│   ├── .env             # Environment variables (DO NOT COMMIT)
│   ├── server.js        # Main server file
│   └── package.json     # Dependencies
│
└── frontend/
    ├── css/             # Stylesheets
    ├── js/              # JavaScript files
    ├── client/          # Client-specific pages
    ├── worker/          # Worker-specific pages
    ├── index.html       # Landing page
    ├── login.html       # Login page
    └── register.html    # Registration page
```

## 🔧 Common Commands

### Backend Commands

```bash
# Install dependencies
npm install

# Start server (production mode)
npm start

# Start server (development mode with auto-reload)
npm run dev

# Run database migrations
npm run migrate

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Frontend

No build step required! Just open the HTML files in a browser.

## 🐛 Troubleshooting

### Backend won't start

**Error: "Cannot find module"**
```bash
cd flashwork/backend
npm install
```

**Error: "Port 5000 already in use"**
- Change PORT in `.env` to another port (e.g., 5001)
- Or kill the process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

**Error: "Database connection failed"**
- Check your internet connection (Neon is cloud-hosted)
- Verify DATABASE_URL in `.env` is correct
- Check if Neon database is active in your dashboard

**Error: "Environment variable not found: DIRECT_URL"**
- Make sure `.env` file has DIRECT_URL
- Restart the server after adding it

### Frontend Issues

**API calls failing (CORS errors)**
- Make sure backend is running on port 5000
- Check `flashwork/frontend/js/config.js` has correct API URL:
  ```javascript
  const API_BASE_URL = 'http://localhost:5000/api';
  ```

**Pages not loading properly**
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)
- Make sure all CSS/JS files are loading

**Login/Register not working**
- Check backend is running
- Open browser DevTools (F12) → Network tab
- Look for failed API requests

## 🔐 Test Accounts

If you've run the seed script, you can use these test accounts:

**Client Account:**
- Email: `client1@example.com`
- Password: `password123`

**Worker Account:**
- Email: `worker1@example.com`
- Password: `password123`

## 📊 Database Management

### View Database with Prisma Studio

```bash
cd flashwork/backend
npx prisma studio
```

Opens a GUI at http://localhost:5555 to view/edit database records.

### Reset Database (⚠️ Deletes all data)

```bash
npx prisma migrate reset
```

### Seed Database with Test Data

If you have a seed file:
```bash
node prisma/final-seed.js
```

## 🌐 Frontend Configuration

Check `flashwork/frontend/js/config.js`:

```javascript
// For local development
const API_BASE_URL = 'http://localhost:5000/api';

// For production (update when deploying)
// const API_BASE_URL = 'https://your-render-app.onrender.com/api';
```

## 🚀 Development Workflow

1. **Start Backend** (Terminal 1):
   ```bash
   cd flashwork/backend
   npm run dev
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd flashwork/frontend
   # Use Live Server or Python HTTP server
   ```

3. **Make Changes**:
   - Backend changes auto-reload with nodemon
   - Frontend changes refresh in browser

4. **Test Your Changes**:
   - Open browser DevTools (F12)
   - Check Console for errors
   - Check Network tab for API calls

## 📝 Next Steps

- [ ] Test login/register functionality
- [ ] Create a test job posting
- [ ] Test worker job browsing
- [ ] Test wallet functionality
- [ ] Check all animations are working
- [ ] Test on different browsers

## 🆘 Need Help?

- Check the error message in terminal
- Look at browser console (F12)
- Review the logs in `flashwork/backend/`
- Check database connection in Neon dashboard
- Verify all environment variables are set

## 🎉 Success Checklist

- ✅ Backend running on http://localhost:5000
- ✅ Frontend accessible in browser
- ✅ Can register a new account
- ✅ Can login successfully
- ✅ Can navigate between pages
- ✅ API calls working (check Network tab)
- ✅ Database operations working

---

**Happy Coding! 🚀**
