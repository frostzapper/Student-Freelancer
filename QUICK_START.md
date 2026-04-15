# ⚡ Quick Start - Run FlashWork Locally

## 🚀 Super Fast Start (2 Commands)

### Option 1: Using the Batch File (Windows)

Double-click `START_LOCAL.bat` or run:
```bash
START_LOCAL.bat
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd flashwork/backend
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd flashwork/frontend
# Then open index.html in your browser
```

## ✅ What You Should See

**Backend Terminal:**
```
Server running on port 5000
Database connected successfully
```

**Browser:**
- Open: `flashwork/frontend/index.html`
- You should see the FlashWork landing page

## 🎯 Quick Test

1. Click "Register" → Create an account
2. Login with your credentials
3. Browse the dashboard

## 📍 URLs

- **Frontend**: Open `flashwork/frontend/index.html` in browser
- **Backend API**: http://localhost:5000
- **Database GUI**: Run `npx prisma studio` (opens http://localhost:5555)

## 🐛 Problems?

**Backend won't start?**
```bash
cd flashwork/backend
npm install
```

**Port 5000 in use?**
- Change `PORT=5000` to `PORT=5001` in `flashwork/backend/.env`

**Database error?**
- Check internet connection (database is cloud-hosted)
- Verify `.env` file exists in `flashwork/backend/`

## 📚 Full Documentation

See `LOCAL_SETUP_GUIDE.md` for detailed instructions.

---

**That's it! You're ready to code! 🎉**
