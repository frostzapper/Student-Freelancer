# 🎯 How to Run FlashWork Locally - Visual Guide

## 📋 Before You Start

Make sure you have:
- ✅ Node.js installed (check: `node --version`)
- ✅ Internet connection (for cloud database)

---

## 🚀 Method 1: One-Click Start (Easiest)

### Windows Users:

1. **Double-click** `START_LOCAL.bat`
2. Wait for "Server running on port 5000"
3. Open `flashwork/frontend/index.html` in your browser
4. **Done!** 🎉

---

## 🚀 Method 2: Manual Start (All Platforms)

### Step 1: Open Terminal/Command Prompt

**Windows:** Press `Win + R`, type `cmd`, press Enter

**Mac/Linux:** Press `Cmd + Space`, type `terminal`, press Enter

### Step 2: Navigate to Backend

```bash
cd flashwork/backend
```

### Step 3: Install Dependencies (First Time Only)

```bash
npm install
```

Wait for installation to complete (1-2 minutes)

### Step 4: Start Backend Server

```bash
npm start
```

**✅ Success looks like:**
```
Server running on port 5000
Database connected successfully
```

**❌ If you see errors, check the Troubleshooting section below**

### Step 5: Open Frontend

**Option A: Using File Explorer**
1. Navigate to `flashwork/frontend/`
2. Double-click `index.html`
3. Opens in your default browser

**Option B: Using VS Code Live Server**
1. Open VS Code
2. Open `flashwork/frontend/index.html`
3. Right-click → "Open with Live Server"
4. Opens at http://localhost:5500

**Option C: Using Python HTTP Server**
```bash
# Open a NEW terminal
cd flashwork/frontend
python -m http.server 8000
```
Then open: http://localhost:8000

---

## 🎮 Using the Application

### 1. Register a New Account

1. Click **"Register"** button
2. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: (at least 6 characters)
   - Role: Choose "Client" or "Worker"
3. Click **"Register"**

### 2. Login

1. Click **"Login"** button
2. Enter your email and password
3. Click **"Login"**

### 3. Explore Features

**As a Client:**
- Post new jobs
- View your posted jobs
- Manage bids
- Check wallet balance

**As a Worker:**
- Browse available jobs
- View recommended jobs
- Submit bids
- Check earnings

---

## 🖥️ Terminal Layout

### Recommended Setup:

```
┌─────────────────────────────────────┐
│  Terminal 1: Backend                │
│  cd flashwork/backend               │
│  npm start                          │
│  (Keep this running)                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Browser: Frontend                  │
│  Open: flashwork/frontend/index.html│
│  Or: http://localhost:5500          │
└─────────────────────────────────────┘
```

---

## 🔍 How to Know It's Working

### Backend (Terminal):
```
✓ Server running on port 5000
✓ Database connected successfully
```

### Frontend (Browser):
- You see the FlashWork landing page
- No errors in browser console (Press F12 → Console tab)
- Can click buttons and navigate

### Test the Connection:
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to register/login
4. You should see API requests to `localhost:5000`

---

## 🐛 Troubleshooting

### Problem: "npm: command not found"

**Solution:** Install Node.js
1. Go to https://nodejs.org/
2. Download LTS version
3. Install and restart terminal

---

### Problem: "Port 5000 already in use"

**Solution 1:** Kill the process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Solution 2:** Change the port
1. Open `flashwork/backend/.env`
2. Change `PORT=5000` to `PORT=5001`
3. Update `flashwork/frontend/js/config.js`:
   ```javascript
   export const API_BASE_URL = 'http://localhost:5001/api';
   ```

---

### Problem: "Cannot find module"

**Solution:**
```bash
cd flashwork/backend
rm -rf node_modules package-lock.json  # Delete old files
npm install  # Reinstall
```

---

### Problem: "Database connection failed"

**Checklist:**
- ✅ Internet connection working?
- ✅ `.env` file exists in `flashwork/backend/`?
- ✅ DATABASE_URL in `.env` is correct?

**Solution:**
1. Check `flashwork/backend/.env` exists
2. Verify DATABASE_URL is set
3. Test internet connection
4. Check Neon dashboard (https://console.neon.tech)

---

### Problem: Frontend shows blank page

**Solution:**
1. Open browser DevTools (F12)
2. Check **Console** tab for errors
3. Check **Network** tab for failed requests
4. Verify backend is running
5. Clear browser cache (Ctrl+Shift+Delete)

---

### Problem: Login/Register not working

**Checklist:**
1. ✅ Backend running? (Check terminal)
2. ✅ No errors in backend terminal?
3. ✅ Browser console shows API calls?

**Solution:**
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to login
4. Look for red/failed requests
5. Click on failed request to see error details

---

## 📊 Useful Commands

### Backend Commands:
```bash
# Start server (production mode)
npm start

# Start server (development mode - auto-reload)
npm run dev

# View database in GUI
npx prisma studio

# Check for errors
node -c server.js
```

### Check What's Running:
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

---

## 🎯 Quick Reference

| What | Where | How |
|------|-------|-----|
| Start Backend | `flashwork/backend` | `npm start` |
| Open Frontend | `flashwork/frontend` | Open `index.html` |
| View Database | `flashwork/backend` | `npx prisma studio` |
| Check Logs | Terminal | Look for errors |
| API URL | Browser DevTools | Network tab |

---

## 🎉 Success Checklist

Before you start coding, verify:

- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend opens in browser without errors
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Can navigate between pages
- [ ] Browser console (F12) shows no errors
- [ ] Network tab shows successful API calls

---

## 🆘 Still Having Issues?

1. **Read the error message carefully**
2. **Check both terminal AND browser console**
3. **Try restarting everything:**
   ```bash
   # Stop backend (Ctrl+C)
   # Close browser
   # Start backend again
   # Open frontend again
   ```
4. **Check the detailed guide:** `LOCAL_SETUP_GUIDE.md`

---

## 📞 Common Error Messages Explained

| Error | Meaning | Fix |
|-------|---------|-----|
| `EADDRINUSE` | Port already in use | Kill process or change port |
| `Cannot find module` | Missing dependencies | Run `npm install` |
| `CORS error` | Frontend can't reach backend | Check backend is running |
| `401 Unauthorized` | Login failed | Check credentials |
| `500 Internal Server Error` | Backend error | Check backend terminal logs |

---

**You're all set! Happy coding! 🚀**

Need more help? Check `LOCAL_SETUP_GUIDE.md` for detailed instructions.
